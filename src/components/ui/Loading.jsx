import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 3, variant = "default" }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded shimmer w-24"></div>
          <div className="h-8 bg-gray-200 rounded shimmer w-32"></div>
        </div>
        <div className="h-12 w-12 bg-gray-200 rounded-full shimmer"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded shimmer w-full"></div>
        <div className="h-3 bg-gray-200 rounded shimmer w-3/4"></div>
      </div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded shimmer w-48"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="px-6 py-4 flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-200 rounded shimmer"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded shimmer w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded shimmer w-1/3"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded shimmer w-20"></div>
            <div className="h-4 bg-gray-200 rounded shimmer w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonForm = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="h-8 bg-gray-200 rounded shimmer w-48"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded shimmer w-24"></div>
            <div className="h-10 bg-gray-200 rounded shimmer w-full"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-4">
        <div className="h-10 bg-gray-200 rounded shimmer w-24"></div>
        <div className="h-10 bg-gray-200 rounded shimmer w-32"></div>
      </div>
    </div>
  );

  if (variant === "cards") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-6", className)}>
        <SkeletonTable />
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className={cn("space-y-6", className)}>
        <SkeletonForm />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
      <SkeletonTable />
    </div>
  );
};

export default Loading;