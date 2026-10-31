"use client";

import React from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  FilterState,
  FurnishingStatus,
  TenantPreference,
  COMMON_AMENITIES,
} from "@/types/property";
import { formatIndianPrice } from "@/lib/utils";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResultsCount: number;
  className?: string;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  totalResultsCount,
  className = "",
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const handleRentChange = (type: "min" | "max", val: number) => {
    onChange({
      ...filters,
      [type === "min" ? "minRent" : "maxRent"]: val,
    });
  };

  const handleFurnishingToggle = (status: FurnishingStatus | "All") => {
    onChange({ ...filters, furnishing: status });
  };

  const handleTenantToggle = (pref: TenantPreference | "All") => {
    onChange({ ...filters, tenantType: pref });
  };

  const handleAmenityToggle = (amenity: string) => {
    const current = [...filters.amenities];
    const index = current.indexOf(amenity);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(amenity);
    }
    onChange({ ...filters, amenities: current });
  };

  const furnishingOptions: (FurnishingStatus | "All")[] = [
    "All",
    "Unfurnished",
    "Semi-Furnished",
    "Fully Furnished",
  ];

  const tenantOptions: (TenantPreference | "All")[] = [
    "All",
    "Family Only",
    "Bachelors Only",
    "Girls Only",
    "Boys Only",
    "Anyone",
  ];

  return (
    <aside
      className={`bg-white rounded-xl border border-slate-200 shadow-card p-4 sm:p-5 flex flex-col gap-6 ${className}`}
    >
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-navy-800" />
          <h3 className="font-bold text-navy-900 text-sm sm:text-base">
            Filters
          </h3>
          <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
            {totalResultsCount} found
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort Listings
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onChange({
              ...filters,
              sortBy: e.target.value as FilterState["sortBy"],
            })
          }
          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:border-navy-700 cursor-pointer"
        >
          <option value="newest">🕒 Newest Posted First</option>
          <option value="price_asc">💵 Rent: Low to High</option>
          <option value="price_desc">💎 Rent: High to Low</option>
          <option value="popular">🔥 Most Viewed</option>
        </select>
      </div>

      {/* Budget / Monthly Rent Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Monthly Rent
          </label>
          <span className="text-xs font-black text-navy-900">
            {formatIndianPrice(filters.minRent)} -{" "}
            {filters.maxRent >= 100000
              ? "₹1,00,000+"
              : formatIndianPrice(filters.maxRent)}
          </span>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="2000"
          max="100000"
          step="1000"
          value={filters.maxRent}
          onChange={(e) => handleRentChange("max", parseInt(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer"
        />

        {/* Quick Rent Buttons */}
        <div className="grid grid-cols-3 gap-1.5 mt-2">
          {[
            { label: "< ₹10k", max: 10000 },
            { label: "< ₹25k", max: 25000 },
            { label: "< ₹50k", max: 50000 },
          ].map((btn) => (
            <button
              key={btn.max}
              type="button"
              onClick={() => handleRentChange("max", btn.max)}
              className={`text-[11px] py-1 px-1.5 rounded border text-center font-semibold transition ${
                filters.maxRent === btn.max
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tenant Preference */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Tenant Preference
        </label>
        <div className="flex flex-wrap gap-1.5">
          {tenantOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleTenantToggle(opt)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition ${
                filters.tenantType === opt
                  ? "bg-navy-900 text-white border-navy-900 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Furnishing Status */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Furnishing Status
        </label>
        <div className="flex flex-wrap gap-1.5">
          {furnishingOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleFurnishingToggle(opt)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition ${
                filters.furnishing === opt
                  ? "bg-navy-900 text-white border-navy-900 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Only Toggle */}
      <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-3">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-navy-950">
              Verified Owners Only
            </span>
          </div>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) =>
              onChange({ ...filters, verifiedOnly: e.target.checked })
            }
            className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Amenities Multi-Checkboxes */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Amenities & Features
        </label>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {COMMON_AMENITIES.slice(0, 10).map((amenity) => {
            const isChecked = filters.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer hover:text-navy-900 py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-3.5 h-3.5 accent-navy-900 rounded cursor-pointer"
                />
                <span className={isChecked ? "font-bold text-navy-900" : ""}>
                  {amenity}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Close / Apply Button */}
      {isMobileDrawer && (
        <div className="pt-2">
          <button
            onClick={onCloseMobileDrawer}
            className="w-full bg-navy-900 text-white font-bold py-2.5 rounded-lg text-sm shadow hover:bg-navy-800"
          >
            Show {totalResultsCount} Properties
          </button>
        </div>
      )}
    </aside>
  );
};
