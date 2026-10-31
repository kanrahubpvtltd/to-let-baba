import React from "react";
import { SearchX, RotateCcw, PlusCircle } from "lucide-react";

interface EmptyStateProps {
  onResetFilters: () => void;
  onOpenPostModal: () => void;
  searchQuery?: string;
  category?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onResetFilters,
  onOpenPostModal,
  searchQuery,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-card max-w-xl mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-black text-navy-900 mb-2">
        No To-Let Listings Found
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 mb-6">
        {searchQuery ? (
          <>
            We couldn&apos;t find any rental listings matching &ldquo;
            <span className="font-semibold text-slate-800">{searchQuery}</span>
            &rdquo; with the selected filters.
          </>
        ) : (
          "There are no active properties in this category or budget range right now."
        )}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onResetFilters}
          className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear All Filters</span>
        </button>

        <button
          onClick={onOpenPostModal}
          className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-amber-400 text-xs font-bold transition shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post To-Let In This Locality</span>
        </button>
      </div>
    </div>
  );
};
