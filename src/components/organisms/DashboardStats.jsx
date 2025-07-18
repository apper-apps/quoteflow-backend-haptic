import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { quotesService } from "@/services/api/quotesService";
import { productsService } from "@/services/api/productsService";

const DashboardStats = () => {
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

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [quotes, products] = await Promise.all([
        quotesService.getAll(),
        productsService.getAll()
      ]);

      const totalQuotes = quotes.length;
      const totalProducts = products.length;
      const pendingQuotes = quotes.filter(q => q.status === "sent").length;
      const acceptedQuotes = quotes.filter(q => q.status === "accepted").length;
      
      const totalRevenue = quotes
        .filter(q => q.status === "accepted")
        .reduce((sum, q) => sum + q.totalCustomerCurrency, 0);
      
      const totalProfit = quotes
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Quotes"
        value={stats.totalQuotes}
        icon="FileText"
        trend={stats.totalQuotes > 0 ? "up" : null}
        trendValue={`${stats.pendingQuotes} pending`}
        gradient
      />
      
      <StatCard
        title="Total Products"
        value={stats.totalProducts}
        icon="Package"
        trend={stats.totalProducts > 0 ? "up" : null}
        trendValue="In catalog"
        gradient
      />
      
      <StatCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon="DollarSign"
        trend={stats.totalRevenue > 0 ? "up" : null}
        trendValue={`${stats.acceptedQuotes} accepted`}
        gradient
      />
      
      <StatCard
        title="Total Profit"
        value={formatCurrency(stats.totalProfit)}
        icon="TrendingUp"
        trend={stats.totalProfit > 0 ? "up" : null}
        trendValue={`${getAcceptanceRate()}% acceptance rate`}
        gradient
      />
      
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