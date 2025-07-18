import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  className, 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  actionLabel = "Add Item",
  onAction,
  icon = "Plus",
  variant = "default"
}) => {
  const getIcon = () => {
    switch (variant) {
      case "search":
        return "Search";
      case "filter":
        return "Filter";
      case "data":
        return "Database";
      default:
        return icon;
    }
  };

  const getGradient = () => {
    switch (variant) {
      case "search":
        return "from-blue-500 to-purple-500";
      case "filter":
        return "from-green-500 to-teal-500";
      case "data":
        return "from-orange-500 to-red-500";
      default:
        return "from-primary to-secondary";
    }
  };

  return (
    <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
      <Card className="max-w-md w-full text-center p-8" variant="premium">
        <div className="flex flex-col items-center space-y-4">
          <div className={cn("p-4 rounded-full bg-gradient-to-br", getGradient())}>
            <ApperIcon name={getIcon()} className="h-8 w-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>

          {onAction && (
            <Button
              onClick={onAction}
              variant="primary"
              icon={getIcon()}
              className="mt-4"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Empty;