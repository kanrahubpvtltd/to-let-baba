"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trash2,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { Property } from "@/types/property";
import {
  formatIndianPrice,
  getWhatsAppLink,
  getTimeAgo,
} from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  isOwner?: boolean;
  onToggleRented?: (id: string, current: boolean) => void;
  onDelete?: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isOwner = false,
  onToggleRented,
  onDelete,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        ];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/property/${property.id}`;
      if (navigator.share) {
        navigator.share({
          title: property.title,
          text: `Check out this rental on To-Let Baba: ${property.title} for ${formatIndianPrice(property.rent_amount)}/mo`,
          url,
        });
      } else {
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  const whatsAppLink = getWhatsAppLink(
    property.whatsapp_number || property.owner_phone,
    property.title,
    property.id
  );

  return (
    <div
      className={`group bg-white rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        property.is_rented_out
          ? "border-slate-300 opacity-80 bg-slate-50/50"
          : "border-slate-200/90 hover:border-amber-400/80 shadow-card hover:shadow-card-hover"
      }`}
    >
      {/* Top Media Gallery Container */}
      <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full bg-slate-100 overflow-hidden select-none">
        <Link href={`/property/${property.id}`} className="block w-full h-full">
          <Image
            src={images[currentImgIndex]}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-102 ${
              property.is_rented_out ? "grayscale" : ""
            }`}
            priority={false}
          />
        </Link>

        {/* Carousel Overlay Arrows (if >1 image) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {property.is_rented_out ? (
            <span className="bg-red-600 text-white text-[10px] font-black tracking-wide uppercase px-2 py-0.5 rounded shadow">
              Rented Out
            </span>
          ) : (
            <>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                <span>0% Brokerage</span>
              </span>

              {property.is_featured && (
                <span className="bg-amber-500 text-navy-950 text-[10px] font-black px-2 py-0.5 rounded shadow flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 text-navy-950 fill-navy-950" />
                  <span>Featured</span>
                </span>
              )}

              {property.is_verified && (
                <span className="bg-navy-900/90 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified Owner</span>
                </span>
              )}
            </>
          )}
        </div>

        {/* Image Counter & Share Button */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
          <button
            onClick={handleShare}
            className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition"
            title="Share Property"
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </button>
          {images.length > 1 && (
            <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {currentImgIndex + 1}/{images.length}
            </span>
          )}
        </div>
      </div>

      {/* Property Information Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rent & Deposit Header */}
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                {formatIndianPrice(property.rent_amount)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ month</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">
                Deposit:{" "}
                <span className="font-semibold text-slate-700">
                  {formatIndianPrice(property.deposit_amount)}
                </span>
              </span>
            </div>
          </div>

          {/* Tags (Category, Furnishing, Tenant) */}
          <div className="flex flex-wrap gap-1.5 my-2">
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {property.category}
            </span>
            <span className="text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/50 px-2 py-0.5 rounded">
              {property.furnishing}
            </span>
            <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              {property.tenant_type}
            </span>
          </div>

          {/* Title with link */}
          <Link href={`/property/${property.id}`} className="block group/title">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover/title:text-amber-600 transition-colors">
              {property.title}
            </h4>
          </Link>

          {/* Location Pin */}
          <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="truncate">
              {property.locality}, {property.city}
            </span>
          </div>

          {/* Amenities snippet */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="text-[11px] text-slate-500 mt-2 line-clamp-1">
              {property.amenities.slice(0, 3).join(" • ")}
              {property.amenities.length > 3 && ` +${property.amenities.length - 3} more`}
            </div>
          )}
        </div>

        {/* Footer Meta & Actions */}
        <div className="pt-3 mt-3 border-t border-slate-100">
          {/* Owner & Time info */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2.5">
            <div className="flex items-center gap-1 truncate max-w-[65%]">
              <User className="w-3 h-3 text-slate-400" />
              <span className="truncate font-medium text-slate-600">
                {property.owner_name}
              </span>
            </div>
            <span>{getTimeAgo(property.created_at)}</span>
          </div>

          {/* Dual High-Converting Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* Call Owner Button */}
            <a
              href={`tel:+91${property.owner_phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white font-bold text-xs transition duration-150 active:scale-95 text-center"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Owner</span>
            </a>

            {/* Direct WhatsApp CTA */}
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition duration-150 active:scale-95 text-center"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Owner Management Row (if owner) */}
          {isOwner && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() =>
                  onToggleRented &&
                  onToggleRented(property.id, property.is_rented_out)
                }
                className={`font-semibold px-2 py-1 rounded transition ${
                  property.is_rented_out
                    ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    : "text-amber-800 bg-amber-50 hover:bg-amber-100"
                }`}
              >
                {property.is_rented_out ? "Mark Available" : "Mark Rented Out"}
              </button>

              <button
                type="button"
                onClick={() => onDelete && onDelete(property.id)}
                className="text-red-600 hover:text-red-700 font-semibold p-1 rounded hover:bg-red-50 flex items-center gap-1"
                title="Delete listing"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
