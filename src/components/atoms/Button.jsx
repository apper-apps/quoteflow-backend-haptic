import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white shadow-lg hover:shadow-xl focus:ring-primary/50 transform hover:scale-105",
    secondary: "bg-gradient-to-r from-secondary to-purple-600 hover:from-purple-600 hover:to-secondary text-white shadow-lg hover:shadow-xl focus:ring-secondary/50 transform hover:scale-105",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500/50",
    success: "bg-gradient-to-r from-success to-green-600 hover:from-green-600 hover:to-success text-white shadow-lg hover:shadow-xl focus:ring-success/50 transform hover:scale-105",
    danger: "bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-error text-white shadow-lg hover:shadow-xl focus:ring-error/50 transform hover:scale-105"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const isLoading = loading || disabled;

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={isLoading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
      )}
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon name={icon} className="mr-2 h-4 w-4" />
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon name={icon} className="ml-2 h-4 w-4" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;