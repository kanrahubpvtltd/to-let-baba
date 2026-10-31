import React from "react";
import { ShieldCheck, IndianRupee, PhoneCall, Zap } from "lucide-react";

export const TrustBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border-y border-navy-800 text-white py-4 sm:py-5 my-6 sm:my-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center sm:text-left">
          {/* Item 1 */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">
                Zero Brokerage
              </h4>
              <p className="text-[11px] text-slate-300">
                100% direct deal between owner & tenant
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">
                Instant WhatsApp
              </h4>
              <p className="text-[11px] text-slate-300">
                One-tap chat with property owner directly
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">
                Verified Indian Localities
              </h4>
              <p className="text-[11px] text-slate-300">
                Handpicked sectors, colonies & societies
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">
                Free Instant Ad Posting
              </h4>
              <p className="text-[11px] text-slate-300">
                Go live in 60 seconds with photos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
