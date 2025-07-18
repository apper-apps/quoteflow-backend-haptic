import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { quotesService } from "@/services/api/quotesService";
import { productsService } from "@/services/api/productsService";
import { userService } from "@/services/api/userService";

const DashboardStats = ({ userRole }) => {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalProfit: 0,
    pendingQuotes: 0,
    acceptedQuotes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
    loadStats();
  }, [userRole]);

const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [user, quotes, products] = await Promise.all([
        userService.getCurrentUser(),
        quotesService.getAll(),
        productsService.getAll()
      ]);

      setCurrentUser(user);
      
      // Filter quotes based on user role
      let filteredQuotes = quotes;
      if (userRole === "customer" || user.role === "customer") {
        filteredQuotes = quotes.filter(q => q.customerId === user.email);
      }

      const totalQuotes = filteredQuotes.length;
      const totalProducts = products.length;
      const pendingQuotes = filteredQuotes.filter(q => q.status === "sent").length;
      const acceptedQuotes = filteredQuotes.filter(q => q.status === "accepted").length;
      
      const totalRevenue = filteredQuotes
        .filter(q => q.status === "accepted")
        .reduce((sum, q) => sum + q.totalCustomerCurrency, 0);
      
      const totalProfit = filteredQuotes
        .filter(q => q.status === "accepted")
        .reduce((sum, q) => {
          const profit = q.items?.reduce((itemSum, item) => {
            const product = products.find(p => p.Id === item.productId);
            if (product) {
              return itemSum + ((item.finalPricePerUnitRMB - product.realCostRMB) * item.quantity);
            }
            return itemSum;
          }, 0) || 0;
          return sum + profit;
        }, 0);

      setStats({
        totalQuotes,
        totalProducts,
        totalRevenue,
        totalProfit,
        pendingQuotes,
        acceptedQuotes
      });
    } catch (err) {
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading variant="cards" rows={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStats} />;
  }

  const formatCurrency = (amount, currency = "USD") => {
    const symbols = { USD: "$", EUR: "€", GBP: "£", RMB: "¥" };
    return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
  };

  const getAcceptanceRate = () => {
    if (stats.totalQuotes === 0) return 0;
    return ((stats.acceptedQuotes / stats.totalQuotes) * 100).toFixed(1);
  };
const isAgent = currentUser?.role === "agent" || userRole === "agent";

  return (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title={isAgent ? "Total Quotes" : "My Quotes"}
        value={stats.totalQuotes}
        icon="FileText"
        trend={stats.totalQuotes > 0 ? "up" : null}
        trendValue={`${stats.pendingQuotes} pending`}
        gradient
      />
      
      {isAgent && (
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="Package"
          trend={stats.totalProducts > 0 ? "up" : null}
          trendValue="In catalog"
          gradient
        />
      )}
      
      <StatCard
        title={isAgent ? "Total Revenue" : "Quote Value"}
        value={formatCurrency(stats.totalRevenue)}
        icon="DollarSign"
        trend={stats.totalRevenue > 0 ? "up" : null}
        trendValue={`${stats.acceptedQuotes} accepted`}
        gradient
      />
      
      {isAgent && (
        <StatCard
          title="Total Profit"
          value={formatCurrency(stats.totalProfit)}
          icon="TrendingUp"
          trend={stats.totalProfit > 0 ? "up" : null}
          trendValue={`${getAcceptanceRate()}% acceptance rate`}
          gradient
        />
      )}
      
      <StatCard
        title="Pending Quotes"
        value={stats.pendingQuotes}
        icon="Clock"
        trend={stats.pendingQuotes > 0 ? "up" : null}
        trendValue="Awaiting response"
        gradient
      />
      
      <StatCard
        title="Accepted Quotes"
        value={stats.acceptedQuotes}
        icon="CheckCircle"
        trend={stats.acceptedQuotes > 0 ? "up" : null}
        trendValue="Successful conversions"
        gradient
      />
    </div>
  );
};

export default DashboardStats;