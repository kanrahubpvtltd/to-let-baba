"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Share2,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  CheckCircle2,
} from "lucide-react";
import { Property } from "@/types/property";
import {
  fetchPropertyById,
  fetchProperties,
  incrementViews,
} from "@/lib/supabase";
import {
  formatIndianPrice,
  formatPhoneNumber,
  getWhatsAppLink,
} from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      const data = await fetchPropertyById(id);
      setProperty(data);
      if (data) {
        incrementViews(id);
        // Load related properties from same city
        const related = await fetchProperties({ city: data.city });
        setRelatedProperties(related.filter((p) => p.id !== data.id).slice(0, 3));
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== "undefined" && property) {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: property.title,
          text: `Check out this To-Let rental: ${property.title} for ${formatIndianPrice(property.rent_amount)}/mo on To-Let Baba`,
          url,
        });
      } else {
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-pulse space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-96 w-full bg-slate-200 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-100 rounded" />
              <div className="h-32 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-64 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md shadow-card">
          <h2 className="text-xl font-black text-navy-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            This listing may have been rented out or removed by the owner.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 bg-navy-900 text-white font-bold px-4 py-2 rounded-lg text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All To-Let Listings</span>
          </Link>
        </div>
      </div>
    );
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        ];

  const whatsAppLink = getWhatsAppLink(
    property.whatsapp_number || property.owner_phone,
    property.title,
    property.id
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-navy-950">
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full aspect-[16/10] max-h-[85vh]">
            <Image
              src={images[activePhotoIdx]}
              alt={property.title}
              fill
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActivePhotoIdx(
                    (prev) => (prev - 1 + images.length) % images.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setActivePhotoIdx((prev) => (prev + 1) % images.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Main Container */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl flex-1">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Listings</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-navy-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs transition"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Main Primary Photo */}
            <div
              onClick={() => setLightboxOpen(true)}
              className="relative aspect-[16/10] md:col-span-3 rounded-xl overflow-hidden bg-slate-100 cursor-pointer group"
            >
              <Image
                src={images[activePhotoIdx]}
                alt={property.title}
                fill
                priority
                className="object-cover group-hover:scale-101 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="bg-emerald-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded shadow">
                  Zero Brokerage
                </span>
                {property.is_verified && (
                  <span className="bg-navy-900 text-amber-300 border border-amber-400/30 text-xs font-bold px-2.5 py-1 rounded shadow flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verified Owner</span>
                  </span>
                )}
                {property.is_rented_out && (
                  <span className="bg-red-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded shadow">
                    Rented Out
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View Fullscreen ({images.length} Photos)</span>
              </button>
            </div>

            {/* Thumbnail Column on Desktop */}
            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[380px]">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative aspect-[16/10] md:aspect-[16/10] w-24 md:w-full rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                    activePhotoIdx === idx
                      ? "border-amber-500 shadow-md scale-98"
                      : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Property Info & Financials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Description, Highlights, Amenities, Safety */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Block */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-navy-900 text-white text-xs font-bold px-2.5 py-1 rounded">
                  {property.category}
                </span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded">
                  {property.furnishing}
                </span>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded">
                  For: {property.tenant_type}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight mb-2">
                {property.title}
              </h1>

              <div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm mb-4">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  {property.address}, {property.locality},{" "}
                  {property.city} - {property.pincode}
                </span>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-center">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">
                    Category
                  </span>
                  <span className="text-xs font-bold text-navy-900 block truncate">
                    {property.category}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">
                    Furnishing
                  </span>
                  <span className="text-xs font-bold text-navy-900 block truncate">
                    {property.furnishing}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">
                    Available From
                  </span>
                  <span className="text-xs font-bold text-navy-900 block truncate">
                    {new Date(property.available_from).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">
                    Views
                  </span>
                  <span className="text-xs font-bold text-navy-900 block truncate">
                    {property.views_count || 1} views
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-3">
                Property Overview & Details
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-3">
                Amenities & Facilities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities && property.amenities.length > 0 ? (
                  property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-800 border border-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">
                    No amenities specified by owner.
                  </p>
                )}
              </div>
            </div>

            {/* Mandatory Safety Guidelines Box */}
            <div className="bg-amber-50/80 border-2 border-amber-300 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-navy-950 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-navy-900 mb-1">
                    To-Let Baba Safety & Anti-Fraud Advisory
                  </h4>
                  <ul className="text-xs text-amber-950/90 space-y-1 list-disc pl-4">
                    <li>
                      <strong>Never transfer money or deposit upfront:</strong> Always visit the flat physically and meet the owner before transferring any token amount.
                    </li>
                    <li>
                      <strong>Verify original ownership papers:</strong> Ask for electricity bill or society maintenance receipt to verify genuine ownership.
                    </li>
                    <li>
                      <strong>Execute a proper rent agreement:</strong> Insist on a written registered rent agreement with security deposit refund clauses clearly specified.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Breakdown & Direct Owner Contact Card */}
          <div className="space-y-6">
            {/* Financials Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card sticky top-20">
              <div className="mb-4">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                  Monthly Rent
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-navy-900 tracking-tight">
                    {formatIndianPrice(property.rent_amount)}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    / month
                  </span>
                </div>
              </div>

              {/* Comprehensive Financial Breakdown Table */}
              <div className="space-y-2.5 py-3 border-y border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Security Deposit (Refundable)</span>
                  <span className="font-bold text-navy-900">
                    {formatIndianPrice(property.deposit_amount)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Monthly Maintenance</span>
                  <span className="font-bold text-navy-900">
                    {property.maintenance_charges > 0
                      ? formatIndianPrice(property.maintenance_charges)
                      : "Included in Rent"}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Brokerage Fee</span>
                  <span className="font-black text-emerald-600 uppercase">
                    ₹0 (ZERO BROKERAGE)
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Notice Period</span>
                  <span className="font-medium text-slate-800">1 Month standard</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-navy-900">
                  <span>Estimated Move-In Total</span>
                  <span className="text-amber-600 font-black">
                    {formatIndianPrice(
                      property.rent_amount + property.deposit_amount
                    )}
                  </span>
                </div>
              </div>

              {/* Owner Contact Information Box */}
              <div className="mt-5 pt-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center font-black text-sm">
                    {property.owner_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900">
                      {property.owner_name}
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Direct Property Owner
                    </span>
                  </div>
                </div>

                {/* Direct High Converting Action Buttons */}
                <div className="space-y-2 mt-4">
                  <a
                    href={`tel:+91${property.owner_phone}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-md transition active:scale-98"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>Call Owner (+91 {formatPhoneNumber(property.owner_phone)})</span>
                  </a>

                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties Carousel/Grid */}
        {relatedProperties.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-black text-navy-900 mb-4">
              Similar To-Let Properties in {property.city}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Sticky Action Bar (For Mobile OLX-style conversion) */}
      <div className="md:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-floating">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-medium">Rent</span>
            <span className="text-base font-black text-navy-900 leading-tight">
              {formatIndianPrice(property.rent_amount)}
              <span className="text-[10px] text-slate-500 font-normal">/mo</span>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <a
              href={`tel:+91${property.owner_phone}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-navy-900 text-white font-bold text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call</span>
            </a>

            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
