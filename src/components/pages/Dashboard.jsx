import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";

const Dashboard = () => {
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
      
      // Redirect based on user role
      if (userData.role === "customer") {
        navigate("/dashboard/customer");
      } else if (userData.role === "agent") {
        navigate("/dashboard/agent");
      }
    } catch (err) {
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = async (role) => {
    try {
      await userService.switchRole(role);
      loadUserData();
    } catch (err) {
      console.error("Failed to switch role:", err);
    }
  };
if (loading) {
    return <Loading variant="cards" rows={3} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadUserData} />;
  }

  // If user data is loaded but no redirect happened, show role selector

return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center" variant="premium">
        <div className="mb-6">
          <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-lg inline-block mb-4">
            <ApperIcon name="Users" className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-2">Select Dashboard</h1>
          <p className="text-gray-600">
            Choose your role to access the appropriate dashboard
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="primary"
            icon="UserCheck"
            onClick={() => handleRoleSwitch("customer")}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg"
          >
            Customer Dashboard
          </Button>
          
          <Button
            variant="primary"
            icon="Shield"
            onClick={() => handleRoleSwitch("agent")}
            className="w-full bg-gradient-to-r from-secondary to-purple-600 hover:shadow-lg"
          >
            Agent Dashboard
          </Button>
        </div>

        {user && (
          <div className="mt-6 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Current: <span className="font-medium">{user.name}</span> ({user.role})
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;