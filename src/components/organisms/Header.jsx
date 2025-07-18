import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onToggleSidebar, className }) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-4 py-4 lg:px-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onToggleSidebar}
            className="lg:hidden mr-2"
          />
          <h2 className="text-xl font-semibold text-gray-900">
            Multi-Agent Quotation System
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Bell"
            className="relative"
          >
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-error rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">Admin Agent</p>
              <p className="text-xs text-gray-500">System Administrator</p>
            </div>
            <div className="h-8 w-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;