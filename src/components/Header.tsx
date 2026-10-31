"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  MapPin,
  Search,
  PlusCircle,
  Building2,
  ChevronDown,
  X,
  UserCheck,
} from "lucide-react";
import { POPULAR_CITIES } from "@/types/property";

interface HeaderProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenPostModal: () => void;
  onOpenMyListings: () => void;
  myListingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  searchQuery,
  onSearchChange,
  onOpenPostModal,
  onOpenMyListings,
  myListingsCount,
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearchInput, setCitySearchInput] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearchInput.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 bg-navy-900 text-white shadow-md border-b border-navy-800">
      {/* Top Notification / Trust Bar */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-navy-950 px-4 py-1 text-xs font-semibold flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-navy-900 text-amber-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
              Zero Brokerage
            </span>
            <span className="truncate">
              Direct Owner-to-Tenant Local House, Flat & PG Rentals in India
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-xs font-medium">
            <span>✓ 100% Free Contact</span>
            <span>✓ Verified Phone & WhatsApp</span>
            <span>✓ No Hidden Commission</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Home className="w-6 h-6 text-navy-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  TO-LET <span className="text-amber-400">BABA</span>
                </span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded hidden sm:inline-block">
                  INDIA
                </span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium tracking-wide hidden sm:block -mt-1">
                Direct Owner Rentals • Zero Brokerage
              </span>
            </div>
          </Link>

          {/* City Selector Dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-700 text-slate-100 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-navy-700 transition shadow-sm"
              aria-label="Select City"
            >
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="max-w-[85px] sm:max-w-[130px] truncate text-left">
                {selectedCity || "All India"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* City Dropdown Menu */}
            {cityDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCityDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-64 bg-white text-navy-900 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2.5 bg-slate-50 border-b border-slate-200">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={citySearchInput}
                        onChange={(e) => setCitySearchInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 text-navy-900 bg-white"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto py-1">
                    <button
                      onClick={() => {
                        onSelectCity("All");
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-amber-50 ${
                        selectedCity === "All" || !selectedCity
                          ? "text-amber-600 bg-amber-50/60 font-bold"
                          : "text-slate-700"
                      }`}
                    >
                      <span>All Cities (All India)</span>
                      {(!selectedCity || selectedCity === "All") && <span>✓</span>}
                    </button>

                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          onSelectCity(city);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-amber-50 ${
                          selectedCity === city
                            ? "text-amber-600 bg-amber-50/60 font-bold"
                            : "text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{city}</span>
                        </div>
                        {selectedCity === city && <span>✓</span>}
                      </button>
                    ))}

                    {filteredCities.length === 0 && (
                      <div className="px-4 py-3 text-center text-xs text-slate-400">
                        City not found. Type city name in search bar!
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Find Flats, 1 RK, PG, Rooms, Shops in your locality..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-navy-800 text-white placeholder-slate-400 text-xs sm:text-sm rounded-lg border border-navy-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-navy-800 rounded-lg transition"
              aria-label="Toggle Mobile Search"
            >
              <Search className="w-5 h-5 text-amber-400" />
            </button>

            {/* My Listings Trigger */}
            <button
              onClick={onOpenMyListings}
              className="relative hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-navy-800 rounded-lg border border-transparent hover:border-navy-700 transition"
              title="Manage Properties posted by you"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>My Listings</span>
              {myListingsCount > 0 && (
                <span className="bg-amber-500 text-navy-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {myListingsCount}
                </span>
              )}
            </button>

            {/* "+ POST TO-LET" High-Converting CTA */}
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-navy-950 font-black px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-navy-950 stroke-[2.5]" />
              <span className="tracking-wide uppercase">+ POST TO-LET</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer (Visible when toggled on mobile) */}
        {mobileSearchOpen && (
          <div className="mt-2.5 pt-2 border-t border-navy-800 md:hidden animate-in slide-in-from-top-2 duration-150">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search flat, PG, colony, locality, rent..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-navy-800 text-white placeholder-slate-400 text-xs rounded-lg border border-navy-700 focus:outline-none focus:border-amber-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
