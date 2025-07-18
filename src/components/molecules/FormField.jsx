import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  type = "input",
  className,
  ...props 
}) => {
  if (type === "select") {
    return (
      <div className={cn("space-y-1", className)}>
        <Select {...props} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <Input {...props} />
    </div>
  );
};

export default FormField;