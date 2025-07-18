import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  variant = "default",
  hover = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "rounded-xl border bg-white shadow-lg transition-all duration-200";
  
  const variants = {
    default: "border-gray-200",
    premium: "border-gray-200 shadow-premium bg-gradient-to-br from-white to-gray-50",
    glass: "glass-card border-white/20"
  };

  const hoverStyles = hover ? "hover:shadow-premium-hover hover:scale-[1.02] cursor-pointer" : "";

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        hoverStyles,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;