import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ 
  className, 
  title = "Something went wrong", 
  message = "We encountered an error while loading your data. Please try again.", 
  onRetry,
  variant = "default"
}) => {
  const getIcon = () => {
    switch (variant) {
      case "network":
        return "Wifi";
      case "server":
        return "Server";
      case "notFound":
        return "FileX";
      default:
        return "AlertCircle";
    }
  };

  const getColors = () => {
    switch (variant) {
      case "network":
        return "text-blue-500";
      case "server":
        return "text-red-500";
      case "notFound":
        return "text-gray-500";
      default:
        return "text-error";
    }
  };

  return (
    <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
      <Card className="max-w-md w-full text-center p-8" variant="premium">
        <div className="flex flex-col items-center space-y-4">
          <div className={cn("p-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200", getColors())}>
            <ApperIcon name={getIcon()} className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>

          {onRetry && (
            <Button
              onClick={onRetry}
              variant="primary"
              icon="RefreshCw"
              className="mt-4"
            >
              Try Again
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Error;