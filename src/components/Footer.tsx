import React from "react";
import Link from "next/link";
import { Home, ShieldCheck, Heart } from "lucide-react";
import { POPULAR_CITIES, CATEGORIES_LIST } from "@/types/property";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-10 pb-8 border-t border-navy-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-navy-800">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <Home className="w-5 h-5 text-navy-950 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white">
                TO-LET <span className="text-amber-400">BABA</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India&apos;s specialized zero-brokerage classifieds portal connecting house owners, flat landlords, PG operators, and tenants directly without any middlemen or commissions.
            </p>
            <div className="text-xs text-amber-400/90 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct Owner Verified Numbers</span>
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Popular Cities
            </h4>
            <ul className="space-y-1.5 text-xs">
              {POPULAR_CITIES.slice(0, 6).map((city) => (
                <li key={city}>
                  <Link
                    href={`/?city=${encodeURIComponent(city)}`}
                    className="hover:text-amber-400 transition"
                  >
                    To-Let in {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rental Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Rental Categories
            </h4>
            <ul className="space-y-1.5 text-xs">
              {CATEGORIES_LIST.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/?category=${encodeURIComponent(cat)}`}
                    className="hover:text-amber-400 transition"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety & Advisory */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Tenant Safety Guide
            </h4>
            <div className="bg-navy-900/80 p-3 rounded-lg border border-navy-800 text-xs space-y-2 text-slate-400">
              <p>
                ⚠️ <strong>Never Transfer Money:</strong> Never pay booking amount or security deposit via UPI/QR code before visiting the flat in person.
              </p>
              <p>
                📄 <strong>Verify Documents:</strong> Verify ownership proof or electricity bill before signing rental agreement.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} To-Let Baba (toletbaba.in). All rights reserved. Zero Brokerage Local Rentals.
          </div>
          <div className="flex items-center space-x-1">
            <span>Built for India with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>• Direct Owner to Tenant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
