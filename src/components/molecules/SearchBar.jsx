import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  className, 
  placeholder = "Search...", 
  value = "", 
  onChange, 
  onClear,
  ...props 
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {value && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={handleClear}
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;