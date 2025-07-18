import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { userService } from "@/services/api/userService";

const Sidebar = ({ isOpen, onClose, className }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error("Failed to load user:", err);
    }
  };

  const getNavItems = () => {
    const baseItems = [
      { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
      { path: "/quotes", label: "Quotes", icon: "FileText" },
      { path: "/products", label: "Products", icon: "Package" },
      { path: "/settings", label: "Settings", icon: "Settings" }
    ];

    if (user?.role === "agent") {
      return [
        ...baseItems,
        { path: "/customers", label: "Customers", icon: "Users" },
        { path: "/reports", label: "Reports", icon: "BarChart3" }
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.path}
      onClick={mobile ? onClose : undefined}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-r-2 border-primary"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )
      }
    >
      <ApperIcon name={item.icon} className="mr-3 h-5 w-5" />
      {item.label}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200", className)}>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                <ApperIcon name="Zap" className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold gradient-text">QuoteFlow Pro</h1>
                <p className="text-sm text-gray-600">Multi-Agent System</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform">
            <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                  <ApperIcon name="Zap" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold gradient-text">QuoteFlow Pro</h1>
                  <p className="text-xs text-gray-600">Multi-Agent System</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <ApperIcon name="X" className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <NavItem key={item.path} item={item} mobile />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;