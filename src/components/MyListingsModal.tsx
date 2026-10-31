"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  UserCheck,
  Building,
  MapPin,
  Trash2,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import { Property } from "@/types/property";
import { formatIndianPrice } from "@/lib/utils";

interface MyListingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  myProperties: Property[];
  onToggleRented: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onOpenPostModal: () => void;
}

export const MyListingsModal: React.FC<MyListingsModalProps> = ({
  isOpen,
  onClose,
  myProperties,
  onToggleRented,
  onDelete,
  onOpenPostModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 bg-navy-900 text-white flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                My Posted To-Let Listings ({myProperties.length})
              </h2>
              <p className="text-[11px] text-slate-300">
                Manage your advertisements, mark as rented out or delete
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of User's Properties */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {myProperties.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Building className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-sm sm:text-base font-bold text-navy-900 mb-1">
                You haven&apos;t posted any properties yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Have a flat, room, PG or shop to let? Post directly to thousands of tenants with zero brokerage!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenPostModal();
                }}
                className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold px-4 py-2 rounded-lg text-xs shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>POST YOUR FIRST PROPERTY FREE</span>
              </button>
            </div>
          ) : (
            myProperties.map((prop) => (
              <div
                key={prop.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                  prop.is_rented_out
                    ? "bg-slate-50 border-slate-300 opacity-80"
                    : "bg-white border-slate-200 shadow-xs hover:border-amber-400"
                }`}
              >
                {/* Thumbnail & Basic info */}
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image
                      src={
                        prop.images[0] ||
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={prop.title}
                      fill
                      className="object-cover"
                    />
                    {prop.is_rented_out && (
                      <div className="absolute inset-0 bg-red-600/70 flex items-center justify-center">
                        <span className="text-[8px] font-black text-white uppercase">
                          RENTED
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-navy-900">
                        {formatIndianPrice(prop.rent_amount)}/mo
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                        {prop.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">
                      {prop.title}
                    </h4>
                    <div className="flex items-center text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-500 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {prop.locality}, {prop.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Link
                    href={`/property/${prop.id}`}
                    className="p-2 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center space-x-1"
                    title="View live page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View</span>
                  </Link>

                  <button
                    onClick={() => onToggleRented(prop.id, prop.is_rented_out)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      prop.is_rented_out
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    {prop.is_rented_out ? "Mark Available" : "Mark Rented"}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this listing?")) {
                        onDelete(prop.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                    title="Delete listing permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Listings are saved locally & connected to Supabase
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenPostModal();
            }}
            className="flex items-center space-x-1.5 bg-navy-900 hover:bg-navy-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Add Another To-Let</span>
          </button>
        </div>
      </div>
    </div>
  );
};
