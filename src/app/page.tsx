"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FilterState,
  Property,
  PropertyCategory,
} from "@/types/property";
import {
  fetchProperties,
  toggleRentedOutStatus,
  deletePropertyListing,
  getMyListingIds,
} from "@/lib/supabase";
import { Header } from "@/components/Header";
import { CategoryPills } from "@/components/CategoryPills";
import { FilterSidebar } from "@/components/FilterSidebar";
import { PropertyCard } from "@/components/PropertyCard";
import { PostPropertyModal } from "@/components/PostPropertyModal";
import { MyListingsModal } from "@/components/MyListingsModal";
import { EmptyState } from "@/components/EmptyState";
import { PropertyGridSkeleton } from "@/components/Skeletons";
import { TrustBanner } from "@/components/TrustBanner";
import { Footer } from "@/components/Footer";
import {
  SlidersHorizontal,
  X,
  CheckCircle,
  PlusCircle,
} from "lucide-react";

const INITIAL_FILTERS: FilterState = {
  city: "All",
  searchQuery: "",
  category: "All",
  minRent: 2000,
  maxRent: 100000,
  furnishing: "All",
  tenantType: "All",
  amenities: [],
  sortBy: "newest",
  verifiedOnly: false,
};

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const [myListingsOpen, setMyListingsOpen] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [myListingIds, setMyListingIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Load properties on filter change
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProperties(filters);
        if (isMounted) {
          setProperties(data);
        }
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Load My Listings IDs on mount
  useEffect(() => {
    setMyListingIds(getMyListingIds());
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Handlers
  const handleSelectCity = (city: string) => {
    setFilters((prev) => ({ ...prev, city }));
  };

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleSelectCategory = (category: PropertyCategory | "All") => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Prepend newly created listing immediately
  const handlePropertyCreated = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
    setMyListingIds((prev) => [newProp.id, ...prev]);
    showNotification(
      `🎉 Your listing "${newProp.title.slice(0, 30)}..." is now LIVE on To-Let Baba!`
    );
  };

  const handleToggleRented = async (id: string, currentStatus: boolean) => {
    const success = await toggleRentedOutStatus(id, currentStatus);
    if (success) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_rented_out: !currentStatus } : p
        )
      );
      showNotification(
        !currentStatus
          ? "Listing marked as RENTED OUT"
          : "Listing marked as AVAILABLE"
      );
    }
  };

  const handleDeleteProperty = async (id: string) => {
    const success = await deletePropertyListing(id);
    if (success) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setMyListingIds((prev) => prev.filter((item) => item !== id));
      showNotification("Listing deleted successfully.");
    }
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: properties.length };
    properties.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [properties]);

  // User's own properties
  const myProperties = useMemo(() => {
    return properties.filter((p) => myListingIds.includes(p.id));
  }, [properties, myListingIds]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-navy-950">
      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-navy-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-amber-400 flex items-center space-x-2 animate-in slide-in-from-right duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* Sticky Header (OLX Style) */}
      <Header
        selectedCity={filters.city}
        onSelectCity={handleSelectCity}
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        onOpenPostModal={() => setPostModalOpen(true)}
        onOpenMyListings={() => setMyListingsOpen(true)}
        myListingsCount={myProperties.length}
      />

      {/* Horizontal Category Pills Bar */}
      <CategoryPills
        selectedCategory={filters.category}
        onSelectCategory={handleSelectCategory}
        categoryCounts={categoryCounts}
      />

      {/* Hero Welcome / Direct Owner Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white py-6 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black bg-amber-500 text-navy-950 px-2 py-0.5 rounded uppercase">
                Zero Commission Portal
              </span>
              <span className="text-xs text-amber-300 font-semibold">
                Direct Owner • No Brokers Allowed
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              Rent Flats, 1 RK, PGs & Houses with{" "}
              <span className="text-amber-400 underline decoration-amber-500/50 decoration-wavy">
                Zero Brokerage
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Browse authentic local rental listings directly posted by homeowners in{" "}
              {filters.city === "All" ? "Delhi NCR, Jaipur, Bengaluru, Mumbai & across India" : filters.city}.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setPostModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-navy-950 font-black px-5 py-3 rounded-xl text-xs sm:text-sm shadow-lg transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>POST FREE TO-LET AD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Sidebar Filters + Property Cards Feed */}
      <main className="container mx-auto px-3 sm:px-4 py-6 flex-1">
        {/* Mobile Filter Toggle & Listing Count Bar */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <div className="text-xs font-bold text-slate-700">
            {loading ? "Searching..." : `${properties.length} Properties Available`}
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-navy-900 text-xs font-bold shadow-xs hover:bg-slate-50"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span>Filters & Sort</span>
            {filters.amenities.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-navy-950 text-[10px] font-bold flex items-center justify-center">
                {filters.amenities.length}
              </span>
            )}
          </button>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              totalResultsCount={properties.length}
            />
          </div>

          {/* Right Listings Feed */}
          <div className="lg:col-span-3 space-y-4">
            {/* Active Filters Tags Bar */}
            {(filters.city !== "All" ||
              filters.category !== "All" ||
              filters.searchQuery ||
              filters.furnishing !== "All" ||
              filters.tenantType !== "All" ||
              filters.verifiedOnly ||
              filters.amenities.length > 0) && (
              <div className="flex flex-wrap items-center gap-1.5 p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-500 mr-1">Active:</span>

                {filters.city !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy-100 text-navy-900 font-semibold">
                    <span>City: {filters.city}</span>
                    <button
                      onClick={() => handleSelectCity("All")}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.category !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                    <span>{filters.category}</span>
                    <button
                      onClick={() => handleSelectCategory("All")}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold">
                    <span>Keyword: &ldquo;{filters.searchQuery}&rdquo;</span>
                    <button
                      onClick={() => handleSearchChange("")}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.furnishing !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold">
                    <span>{filters.furnishing}</span>
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, furnishing: "All" }))
                      }
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.tenantType !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold">
                    <span>{filters.tenantType}</span>
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, tenantType: "All" }))
                      }
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.verifiedOnly && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold">
                    <span>Verified Only</span>
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, verifiedOnly: false }))
                      }
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 ml-auto"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Properties Feed Grid */}
            {loading ? (
              <PropertyGridSkeleton count={6} />
            ) : properties.length === 0 ? (
              <EmptyState
                onResetFilters={handleResetFilters}
                onOpenPostModal={() => setPostModalOpen(true)}
                searchQuery={filters.searchQuery}
                category={filters.category}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isOwner={myListingIds.includes(property.id)}
                    onToggleRented={handleToggleRented}
                    onDelete={handleDeleteProperty}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Trust & Guarantee Banner */}
      <TrustBanner />

      {/* Footer */}
      <Footer />

      {/* Mobile Multi-Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-h-[88vh] w-full max-w-lg overflow-y-auto p-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-navy-900">
                Filter & Sort Properties
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              totalResultsCount={properties.length}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Post a Property Multi-Step Modal */}
      <PostPropertyModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        onSuccess={handlePropertyCreated}
        defaultCity={filters.city}
      />

      {/* My Listings Management Modal */}
      <MyListingsModal
        isOpen={myListingsOpen}
        onClose={() => setMyListingsOpen(false)}
        myProperties={myProperties}
        onToggleRented={handleToggleRented}
        onDelete={handleDeleteProperty}
        onOpenPostModal={() => {
          setMyListingsOpen(false);
          setPostModalOpen(true);
        }}
      />
    </div>
  );
}
