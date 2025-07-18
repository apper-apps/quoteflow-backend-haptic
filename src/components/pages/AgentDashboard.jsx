import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardStats from "@/components/organisms/DashboardStats";
import QuotesList from "@/components/organisms/QuotesList";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "New Quote",
      description: "Create a new quotation for a customer",
      icon: "Plus",
      action: () => navigate("/quotes"),
      color: "from-primary to-blue-600"
    },
    {
      title: "Add Product",
      description: "Add a new product to your catalog",
      icon: "Package",
      action: () => navigate("/products"),
      color: "from-secondary to-purple-600"
    },
    {
      title: "View Reports",
      description: "Analyze your quotation performance",
      icon: "BarChart3",
      action: () => navigate("/reports"),
      color: "from-success to-green-600"
    },
    {
      title: "Manage Customers",
      description: "View and manage customer relationships",
      icon: "Users",
      action: () => navigate("/customers"),
      color: "from-warning to-orange-600"
    }
  ];

  if (loading) {
    return <Loading variant="cards" rows={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadUserData} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Agent Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name || 'Agent'} - Multi-agent quotation system
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

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6" variant="premium">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Quotes</h2>
            <QuotesList />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6" variant="premium">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Users" className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Active Agents</span>
                </div>
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-success/10 to-green-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Zap" className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium">System Status</span>
                </div>
                <span className="text-sm font-bold text-success">Online</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-warning/10 to-yellow-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Clock" className="h-5 w-5 text-warning" />
                  <span className="text-sm font-medium">Pending Tasks</span>
                </div>
                <span className="text-sm font-bold text-warning">2</span>
              </div>
            </div>
          </Card>

          <Card className="p-6" variant="premium">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Tools</h3>
            <div className="space-y-3">
              <Button
                variant="ghost"
                icon="Calculator"
                onClick={() => navigate("/quotes")}
                className="w-full justify-start"
              >
                Markup Calculator
              </Button>
              <Button
                variant="ghost"
                icon="TrendingUp"
                onClick={() => navigate("/reports")}
                className="w-full justify-start"
              >
                Performance Analytics
              </Button>
              <Button
                variant="ghost"
                icon="Settings"
                onClick={() => navigate("/settings")}
                className="w-full justify-start"
              >
                System Configuration
              </Button>
            </div>
          </Card>

          <Card className="p-6" variant="premium">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-info/10 to-blue-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  Use the markup calculator to automatically apply profit margins to your quotes.
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-secondary/10 to-purple-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  Multi-currency support includes automatic 3% buffer for exchange rate fluctuations.
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-success/10 to-green-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  Track supplier performance and build trusted vendor relationships.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;