"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Upload,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import {
  CATEGORIES_LIST,
  POPULAR_CITIES,
  COMMON_AMENITIES,
  Property,
} from "@/types/property";
import { createPropertyListing, uploadPropertyPhoto } from "@/lib/supabase";

// Zod schema with strict Indian mobile phone validation
const postPropertySchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title cannot exceed 120 characters"),
  category: z.enum([
    "1 RK / Room",
    "1 BHK Flat",
    "2 BHK Flat",
    "3+ BHK Flat",
    "Independent House/Villa",
    "PG / Co-living",
    "Commercial Shop / Office",
  ]),
  furnishing: z.enum(["Unfurnished", "Semi-Furnished", "Fully Furnished"]),
  tenant_type: z.enum([
    "Family Only",
    "Bachelors Only",
    "Girls Only",
    "Boys Only",
    "Anyone",
  ]),
  available_from: z.string().min(1, "Available date is required"),

  rent_amount: z.coerce
    .number()
    .min(500, "Rent must be at least ₹500")
    .max(2000000, "Enter realistic rent amount"),
  deposit_amount: z.coerce
    .number()
    .min(0, "Deposit cannot be negative"),
  maintenance_charges: z.coerce.number(),

  city: z.string().min(2, "City name is required"),
  locality: z.string().min(3, "Locality/Colony is required"),
  sub_locality: z.string().optional(),
  address: z.string().min(5, "Street address is required"),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Enter valid 6-digit Indian PIN code"),

  description: z
    .string()
    .min(10, "Please describe the property (min 10 characters)"),
  amenities: z.array(z.string()),
  images: z.array(z.string()).min(1, "Please upload at least 1 photo"),

  owner_name: z.string().min(2, "Owner name is required"),
  owner_phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian Mobile Number starting with 6, 7, 8 or 9"),
  whatsapp_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian WhatsApp Number"),
});

export type PostPropertyFormValues = z.infer<typeof postPropertySchema>;

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProperty: Property) => void;
  defaultCity?: string;
}

const SAMPLE_PHOTO_PRESETS = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
];

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultCity = "Delhi NCR",
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sameAsPhone, setSameAsPhone] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<PostPropertyFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(postPropertySchema) as any,
    defaultValues: {
      category: "2 BHK Flat",
      furnishing: "Semi-Furnished",
      tenant_type: "Anyone",
      available_from: new Date().toISOString().split("T")[0],
      maintenance_charges: 0,
      city: defaultCity === "All" ? "Delhi NCR" : defaultCity,
      amenities: ["Car Parking", "Lift / Elevator", "Balcony / Terrace"],
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      ],
      description:
        "Spacious, airy and well-ventilated apartment in a prime location. 24 hours water supply, clean society, safe neighborhood. Direct owner to tenant with zero brokerage.",
    },
  });

  const selectedAmenities = watch("amenities") || [];
  const selectedImages = watch("images") || [];
  const ownerPhoneVal = watch("owner_phone");

  if (!isOpen) return null;

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(["title", "category", "furnishing", "tenant_type", "available_from"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["rent_amount", "deposit_amount", "maintenance_charges"]);
    } else if (currentStep === 3) {
      isValid = await trigger(["city", "locality", "address", "pincode"]);
    } else if (currentStep === 4) {
      isValid = await trigger(["description", "amenities"]);
    } else if (currentStep === 5) {
      isValid = await trigger(["images"]);
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAmenityToggle = (amenity: string) => {
    const next = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setValue("amenities", next, { shouldValidate: true });
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (selectedImages.length + files.length > 6) {
      alert("You can upload a maximum of 6 images.");
      return;
    }

    setUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadPropertyPhoto(file));
      const urls = await Promise.all(uploadPromises);
      setValue("images", [...selectedImages, ...urls], { shouldValidate: true });
    } catch (err) {
      console.error("Upload error", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSamplePhoto = (url: string) => {
    if (selectedImages.length >= 6) {
      alert("Maximum 6 photos allowed");
      return;
    }
    setValue("images", [...selectedImages, url], { shouldValidate: true });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const filtered = selectedImages.filter((_, idx) => idx !== indexToRemove);
    setValue("images", filtered, { shouldValidate: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue("owner_phone", val, { shouldValidate: true });
    if (sameAsPhone) {
      setValue("whatsapp_number", val, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: PostPropertyFormValues) => {
    setIsSubmitting(true);
    try {
      const created = await createPropertyListing({
        title: data.title,
        description: data.description,
        category: data.category,
        rent_amount: data.rent_amount,
        deposit_amount: data.deposit_amount,
        maintenance_charges: data.maintenance_charges || 0,
        furnishing: data.furnishing,
        tenant_type: data.tenant_type,
        available_from: data.available_from,
        city: data.city,
        locality: data.locality,
        sub_locality: data.sub_locality || null,
        address: data.address,
        pincode: data.pincode,
        amenities: data.amenities,
        images: data.images,
        owner_name: data.owner_name,
        owner_phone: data.owner_phone,
        whatsapp_number: sameAsPhone ? data.owner_phone : data.whatsapp_number,
      });

      onSuccess(created);
      onClose();
    } catch (err) {
      console.error("Failed to post property:", err);
      alert("Something went wrong while posting your listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    "Basics",
    "Financials",
    "Location",
    "Amenities",
    "Photos",
    "Owner Info",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-navy-900 text-white flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-navy-950 flex items-center justify-center font-black">
              +
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Post To-Let Property
              </h2>
              <p className="text-[11px] text-amber-300 font-medium -mt-0.5">
                Direct Owner • 100% Free • Zero Brokerage
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

        {/* Progress Bar & Steps Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-navy-900">
              Step {currentStep} of 6: {stepLabels[currentStep - 1]}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {Math.round((currentStep / 6) * 100)}% Completed
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
        >
          {/* STEP 1: BASICS */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Listing Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spacious 2 BHK Semi-Furnished Flat near Metro Station"
                  {...register("title")}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Property Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("category")}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Furnishing Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("furnishing")}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Tenant Preference <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("tenant_type")}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="Anyone">Anyone (No restriction)</option>
                    <option value="Family Only">Family Only</option>
                    <option value="Bachelors Only">Bachelors Only</option>
                    <option value="Girls Only">Girls Only</option>
                    <option value="Boys Only">Boys Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Available From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("available_from")}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  />
                  {errors.available_from && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.available_from.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FINANCIALS */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200/60 text-xs text-amber-900">
                💡 <strong>Fair Pricing Tip:</strong> Listings with realistic rent and security deposits attract up to 3x more genuine tenants on To-Let Baba.
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Monthly Rent (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    {...register("rent_amount")}
                    className="w-full text-sm pl-8 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                {errors.rent_amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.rent_amount.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Security Deposit (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 30000"
                      {...register("deposit_amount")}
                      className="w-full text-sm pl-8 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  {errors.deposit_amount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.deposit_amount.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Maintenance Charges / Mo (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="0 if included"
                      {...register("maintenance_charges")}
                      className="w-full text-sm pl-8 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Enter 0 if maintenance is included in rent
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    list="city-options"
                    placeholder="e.g. Jaipur, Bengaluru, Delhi NCR"
                    {...register("city")}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                  <datalist id="city-options">
                    {POPULAR_CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Locality / Sector / Colony <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Malviya Nagar, Sector 62, Koramangala"
                    {...register("locality")}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                  {errors.locality && (
                    <p className="text-red-500 text-xs mt-1">{errors.locality.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Sub-locality / Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near WTP Mall or Behind Metro Station"
                  {...register("sub_locality")}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    Building / Flat / Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 301, Shivani Residency, 5th Cross"
                    {...register("address")}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="6 Digits"
                    {...register("pincode")}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AMENITIES & DESCRIPTION */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Select Available Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_AMENITIES.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`text-left text-xs p-2.5 rounded-lg border flex items-center justify-between transition ${
                          isSelected
                            ? "bg-navy-900 text-white border-navy-900 font-bold"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate">{amenity}</span>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Property Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide details about ventilation, floor, balcony, rules, water supply, electricity..."
                  {...register("description")}
                  className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: MEDIA UPLOAD */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50/70 hover:bg-amber-50/30 transition">
                <Upload className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                <h4 className="text-sm font-bold text-navy-900">
                  Upload Property Photos (1 to 6 images)
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Upload JPG, PNG or WEBP photos. Real photos get 5x more tenant inquiries!
                </p>

                <label className="inline-block bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold py-2 px-4 rounded-lg cursor-pointer transition">
                  {uploadingImage ? "Uploading..." : "Browse Files from Device"}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                    disabled={uploadingImage || selectedImages.length >= 6}
                  />
                </label>

                {/* Quick Sample Photos for testing */}
                <div className="mt-4 pt-3 border-t border-slate-200 text-left">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    Or click to add high-res sample interior photos:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_PHOTO_PRESETS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddSamplePhoto(url)}
                        className="text-[11px] bg-white border border-slate-300 hover:border-amber-500 text-slate-700 px-2 py-1 rounded shadow-xs"
                      >
                        + Room Photo {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photo Previews */}
              {selectedImages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-navy-900">
                      Uploaded Photos ({selectedImages.length}/6)
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      First photo will be the main listing cover
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {selectedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group bg-slate-100"
                      >
                        <Image
                          src={img}
                          alt={`Uploaded preview ${idx + 1}`}
                          fill
                          sizes="150px"
                          className="object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-amber-500 text-navy-950 text-[9px] font-black px-1.5 py-0.2 rounded z-10">
                            COVER
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition shadow z-10"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.images && (
                <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>
              )}
            </div>
          )}

          {/* STEP 6: CONTACT INFORMATION */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Zero Brokerage Protection:</strong> Your phone number will only be visible to verified tenants seeking direct rental connection. No spam brokers allowed.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  Owner Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  {...register("owner_name")}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                />
                {errors.owner_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.owner_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                  10-Digit Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-500 font-bold text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98XXXXXXXX"
                    value={ownerPhoneVal || ""}
                    onChange={handlePhoneChange}
                    className="w-full text-sm pl-12 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                {errors.owner_phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.owner_phone.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => {
                      setSameAsPhone(e.target.checked);
                      if (e.target.checked && ownerPhoneVal) {
                        setValue("whatsapp_number", ownerPhoneVal, { shouldValidate: true });
                      }
                    }}
                    className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                  />
                  <span>WhatsApp Number is same as Phone Number</span>
                </label>

                {!sameAsPhone && (
                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                      Dedicated WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-slate-500 font-bold text-sm">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="WhatsApp Number"
                        {...register("whatsapp_number")}
                        className="w-full text-sm pl-12 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    {errors.whatsapp_number && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.whatsapp_number.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Footer Navigation */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center space-x-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow transition"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-navy-950 text-xs sm:text-sm font-black shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                <span>{isSubmitting ? "PUBLISHING..." : "PUBLISH TO-LET AD NOW"}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
