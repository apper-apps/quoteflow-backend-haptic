import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className,
  gradient = false,
  ...props 
}) => {
  const getTrendColor = () => {
    if (!trend) return "text-gray-500";
    return trend === "up" ? "text-success" : "text-error";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === "up" ? "TrendingUp" : "TrendingDown";
  };

  return (
    <Card 
      className={cn("p-6", className)} 
      variant={gradient ? "premium" : "default"}
      hover
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={cn(
            "text-2xl font-bold animate-number",
            gradient ? "gradient-text" : "text-gray-900"
          )}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={getTrendIcon()} 
                className={cn("h-4 w-4 mr-1", getTrendColor())} 
              />
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
            <ApperIcon name={icon} className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;