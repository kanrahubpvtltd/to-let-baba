import React from "react";

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card flex flex-col justify-between animate-pulse">
      {/* Photo box skeleton */}
      <div className="aspect-[16/10] w-full bg-slate-200" />

      {/* Body skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>

        <div className="flex gap-1.5">
          <div className="h-4 w-16 bg-slate-100 rounded" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
          <div className="h-4 w-14 bg-slate-100 rounded" />
        </div>

        <div className="h-5 w-full bg-slate-200 rounded" />

        <div className="h-3 w-32 bg-slate-100 rounded" />

        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <div className="h-8 bg-slate-200 rounded-lg" />
          <div className="h-8 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const PropertyGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
};
