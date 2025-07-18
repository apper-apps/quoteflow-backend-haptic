import React from "react";
import { cn } from "@/utils/cn";

const TableRow = ({ 
  children, 
  className,
  hover = true,
  selected = false,
  onClick,
  ...props 
}) => {
  const baseStyles = "transition-all duration-200";
  const hoverStyles = hover ? "hover:bg-gray-50" : "";
  const selectedStyles = selected ? "bg-primary/5 border-l-4 border-primary" : "";
  const clickableStyles = onClick ? "cursor-pointer" : "";

  return (
    <tr
      className={cn(
        baseStyles,
        hoverStyles,
        selectedStyles,
        clickableStyles,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
};

export default TableRow;