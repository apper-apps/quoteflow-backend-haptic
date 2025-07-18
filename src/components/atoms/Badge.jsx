import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "md",
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center rounded-full font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-success/10 to-green-100 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-yellow-100 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
    info: "bg-gradient-to-r from-info/10 to-blue-100 text-info border border-info/20",
    primary: "bg-gradient-to-r from-primary/10 to-blue-100 text-primary border border-primary/20",
    secondary: "bg-gradient-to-r from-secondary/10 to-purple-100 text-secondary border border-secondary/20"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;