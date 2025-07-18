import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { quotesService } from "@/services/api/quotesService";
import { userService } from "@/services/api/userService";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myQuotes: 0,
    pendingQuotes: 0,
    acceptedQuotes: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [userData, quotes] = await Promise.all([
        userService.getCurrentUser(),
        quotesService.getAll()
      ]);

      setUser(userData);
      
      // Filter quotes for customer view (in real app, this would be server-side)
      const customerQuotes = quotes.filter(q => q.customerId === userData.email);
      
      const myQuotes = customerQuotes.length;
      const pendingQuotes = customerQuotes.filter(q => q.status === "sent").length;
      const acceptedQuotes = customerQuotes.filter(q => q.status === "accepted").length;
      const totalValue = customerQuotes
        .filter(q => q.status === "accepted")
        .reduce((sum, q) => sum + q.totalCustomerCurrency, 0);

      setStats({
        myQuotes,
        pendingQuotes,
        acceptedQuotes,
        totalValue
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Request Quote",
      description: "Submit a new quote request",
      icon: "Plus",
      action: () => navigate("/quotes"),
      color: "from-primary to-blue-600"
    },
    {
      title: "View Products",
      description: "Browse available products",
      icon: "Package",
      action: () => navigate("/products"),
      color: "from-secondary to-purple-600"
    }
  ];

  if (loading) {
    return <Loading variant="cards" rows={4} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const formatCurrency = (amount, currency = "USD") => {
    const symbols = { USD: "$", EUR: "€", GBP: "£", RMB: "¥" };
    return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Customer Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name || 'Customer'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="primary"
              icon={action.icon}
              onClick={action.action}
              className={`bg-gradient-to-r ${action.color} hover:shadow-lg transform hover:scale-105`}
            >
              {action.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Quotes"
          value={stats.myQuotes}
          icon="FileText"
          trend={stats.myQuotes > 0 ? "up" : null}
          trendValue="Total requests"
          gradient
        />
        
        <StatCard
          title="Pending Quotes"
          value={stats.pendingQuotes}
          icon="Clock"
          trend={stats.pendingQuotes > 0 ? "up" : null}
          trendValue="Awaiting approval"
          gradient
        />
        
        <StatCard
          title="Accepted Quotes"
          value={stats.acceptedQuotes}
          icon="CheckCircle"
          trend={stats.acceptedQuotes > 0 ? "up" : null}
          trendValue="Approved requests"
          gradient
        />
        
        <StatCard
          title="Total Value"
          value={formatCurrency(stats.totalValue)}
          icon="DollarSign"
          trend={stats.totalValue > 0 ? "up" : null}
          trendValue="Accepted quotes"
          gradient
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6" variant="premium">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="FileText" className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Latest Quote Request</span>
              </div>
              <span className="text-sm font-bold text-primary">Today</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-success/10 to-green-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="CheckCircle" className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Quote Approved</span>
              </div>
              <span className="text-sm font-bold text-success">Yesterday</span>
            </div>
          </div>
        </Card>

        <Card className="p-6" variant="premium">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
          <div className="space-y-3">
            <Button
              variant="ghost"
              icon="FileText"
              onClick={() => navigate("/quotes")}
              className="w-full justify-start"
            >
              View All My Quotes
            </Button>
            <Button
              variant="ghost"
              icon="Package"
              onClick={() => navigate("/products")}
              className="w-full justify-start"
            >
              Browse Product Catalog
            </Button>
            <Button
              variant="ghost"
              icon="Settings"
              onClick={() => navigate("/settings")}
              className="w-full justify-start"
            >
              Account Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;