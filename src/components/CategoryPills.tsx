"use client";

import React, { useRef } from "react";
import {
  Building,
  Home,
  Store,
  Users,
  Layers,
  ChevronLeft,
  ChevronRight,
  Bed,
} from "lucide-react";
import { PropertyCategory } from "@/types/property";

interface CategoryPillsProps {
  selectedCategory: PropertyCategory | "All";
  onSelectCategory: (category: PropertyCategory | "All") => void;
  categoryCounts?: Record<string, number>;
}

interface CategoryOption {
  id: PropertyCategory | "All";
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const CATEGORY_ITEMS: CategoryOption[] = [
  {
    id: "All",
    label: "All To-Let",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: "1 RK / Room",
    label: "1 RK / Room",
    icon: <Bed className="w-4 h-4" />,
    badge: "Budget",
  },
  {
    id: "1 BHK Flat",
    label: "1 BHK Flat",
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: "2 BHK Flat",
    label: "2 BHK Flat",
    icon: <Home className="w-4 h-4" />,
    badge: "Popular",
  },
  {
    id: "3+ BHK Flat",
    label: "3+ BHK Flat",
    icon: <Building className="w-4 h-4" />,
  },
  {
    id: "Independent House/Villa",
    label: "Kothi / Villa",
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: "PG / Co-living",
    label: "PG / Co-living",
    icon: <Users className="w-4 h-4" />,
    badge: "With Food",
  },
  {
    id: "Commercial Shop / Office",
    label: "Commercial / Shop",
    icon: <Store className="w-4 h-4" />,
  },
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-white border-b border-slate-200 py-2.5 shadow-xs">
      <div className="container mx-auto px-3 sm:px-4 flex items-center">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-600 hover:text-navy-900 hover:bg-slate-50 shadow-xs mr-2 flex-shrink-0 z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Pills Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full"
        >
          {CATEGORY_ITEMS.map((item) => {
            const isSelected = selectedCategory === item.id;
            const count = categoryCounts ? categoryCounts[item.id] : undefined;

            return (
              <button
                key={item.id}
                onClick={() => onSelectCategory(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 border ${
                  isSelected
                    ? "bg-navy-900 text-white border-navy-900 shadow-sm scale-102"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <span className={isSelected ? "text-amber-400" : "text-slate-500"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>

                {item.badge && !isSelected && (
                  <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                    {item.badge}
                  </span>
                )}

                {count !== undefined && count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                      isSelected ? "bg-amber-500 text-navy-950" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-600 hover:text-navy-900 hover:bg-slate-50 shadow-xs ml-2 flex-shrink-0 z-10"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
