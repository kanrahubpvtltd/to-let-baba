import { createClient } from "@supabase/supabase-js";
import { Property, PropertyFormData, FilterState } from "@/types/property";
import { INITIAL_PROPERTIES } from "@/data/seedProperties";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project-id")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

const LOCAL_STORAGE_KEY = "tolet_baba_properties_v1";
const MY_LISTINGS_KEY = "tolet_baba_my_listings_v1";

// Helper to get local data
function getLocalProperties(): Property[] {
  if (typeof window === "undefined") {
    return INITIAL_PROPERTIES;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
      return INITIAL_PROPERTIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROPERTIES;
  }
}

// Helper to save local data
function saveLocalProperties(props: Property[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(props));
    } catch (e) {
      console.error("Failed to save properties to localStorage", e);
    }
  }
}

export async function fetchProperties(filters?: Partial<FilterState>): Promise<Property[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("is_active", true);

      if (filters?.city && filters.city !== "All") {
        query = query.ilike("city", `%${filters.city}%`);
      }

      if (filters?.category && filters.category !== "All") {
        query = query.eq("category", filters.category);
      }

      if (filters?.furnishing && filters.furnishing !== "All") {
        query = query.eq("furnishing", filters.furnishing);
      }

      if (filters?.tenantType && filters.tenantType !== "All") {
        query = query.eq("tenant_type", filters.tenantType);
      }

      if (filters?.minRent !== undefined) {
        query = query.gte("rent_amount", filters.minRent);
      }

      if (filters?.maxRent !== undefined && filters.maxRent < 100000) {
        query = query.lte("rent_amount", filters.maxRent);
      }

      if (filters?.verifiedOnly) {
        query = query.eq("is_verified", true);
      }

      if (filters?.sortBy === "price_asc") {
        query = query.order("rent_amount", { ascending: true });
      } else if (filters?.sortBy === "price_desc") {
        query = query.order("rent_amount", { ascending: false });
      } else if (filters?.sortBy === "popular") {
        query = query.order("views_count", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        console.warn("Supabase fetch error, falling back to local dataset:", error.message);
      } else if (data && data.length > 0) {
        return data as Property[];
      }
    } catch (err) {
      console.warn("Supabase fetch exception:", err);
    }
  }

  // Local fallback with full filtering logic
  let items = getLocalProperties().filter((p) => p.is_active);

  if (filters?.city && filters.city !== "All") {
    const c = filters.city.toLowerCase();
    items = items.filter((p) => p.city.toLowerCase().includes(c));
  }

  if (filters?.category && filters.category !== "All") {
    items = items.filter((p) => p.category === filters.category);
  }

  if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
    const q = filters.searchQuery.toLowerCase().trim();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        (p.sub_locality && p.sub_locality.toLowerCase().includes(q)) ||
        p.city.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }

  if (filters?.furnishing && filters.furnishing !== "All") {
    items = items.filter((p) => p.furnishing === filters.furnishing);
  }

  if (filters?.tenantType && filters.tenantType !== "All") {
    items = items.filter((p) => p.tenant_type === filters.tenantType || p.tenant_type === "Anyone");
  }

  if (filters?.minRent !== undefined) {
    items = items.filter((p) => p.rent_amount >= filters.minRent!);
  }

  if (filters?.maxRent !== undefined && filters.maxRent < 100000) {
    items = items.filter((p) => p.rent_amount <= filters.maxRent!);
  }

  if (filters?.amenities && filters.amenities.length > 0) {
    items = items.filter((p) =>
      filters.amenities!.every((reqAmenity) =>
        p.amenities?.some((a) => a.toLowerCase().includes(reqAmenity.toLowerCase()))
      )
    );
  }

  if (filters?.verifiedOnly) {
    items = items.filter((p) => p.is_verified);
  }

  // Sort
  if (filters?.sortBy === "price_asc") {
    items.sort((a, b) => a.rent_amount - b.rent_amount);
  } else if (filters?.sortBy === "price_desc") {
    items.sort((a, b) => b.rent_amount - a.rent_amount);
  } else if (filters?.sortBy === "popular") {
    items.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
  } else {
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return items;
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        return data as Property;
      }
    } catch (e) {
      console.warn("Supabase fetch single error:", e);
    }
  }

  const items = getLocalProperties();
  const found = items.find((p) => p.id === id);
  return found || null;
}

export async function createPropertyListing(data: PropertyFormData): Promise<Property> {
  const newProperty: Property = {
    ...data,
    id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_verified: true,
    is_featured: false,
    is_active: true,
    is_rented_out: false,
    views_count: 1,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: inserted, error } = await supabase
        .from("properties")
        .insert([
          {
            title: newProperty.title,
            description: newProperty.description,
            category: newProperty.category,
            rent_amount: newProperty.rent_amount,
            deposit_amount: newProperty.deposit_amount,
            maintenance_charges: newProperty.maintenance_charges,
            furnishing: newProperty.furnishing,
            tenant_type: newProperty.tenant_type,
            available_from: newProperty.available_from,
            city: newProperty.city,
            locality: newProperty.locality,
            sub_locality: newProperty.sub_locality,
            address: newProperty.address,
            pincode: newProperty.pincode,
            amenities: newProperty.amenities,
            images: newProperty.images,
            owner_name: newProperty.owner_name,
            owner_phone: newProperty.owner_phone,
            whatsapp_number: newProperty.whatsapp_number,
            is_verified: newProperty.is_verified,
            is_featured: newProperty.is_featured,
            is_active: newProperty.is_active,
            is_rented_out: newProperty.is_rented_out,
            views_count: newProperty.views_count,
          },
        ])
        .select()
        .single();

      if (!error && inserted) {
        saveMyListingId(inserted.id);
        return inserted as Property;
      }
    } catch (err) {
      console.warn("Supabase insert error, falling back to local persistence:", err);
    }
  }

  // Local fallback
  const items = getLocalProperties();
  const updated = [newProperty, ...items];
  saveLocalProperties(updated);
  saveMyListingId(newProperty.id);

  return newProperty;
}

export async function toggleRentedOutStatus(id: string, currentStatus: boolean): Promise<boolean> {
  const newStatus = !currentStatus;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("properties")
        .update({ is_rented_out: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase toggle rented error:", e);
    }
  }

  const items = getLocalProperties();
  const index = items.findIndex((p) => p.id === id);
  if (index !== -1) {
    items[index].is_rented_out = newStatus;
    items[index].updated_at = new Date().toISOString();
    saveLocalProperties(items);
    return true;
  }
  return false;
}

export async function deletePropertyListing(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase delete error:", e);
    }
  }

  const items = getLocalProperties();
  const filtered = items.filter((p) => p.id !== id);
  saveLocalProperties(filtered);
  removeMyListingId(id);
  return true;
}

export async function incrementViews(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.rpc("increment_views", { property_id: id });
    } catch {
      // ignore
    }
  }

  const items = getLocalProperties();
  const prop = items.find((p) => p.id === id);
  if (prop) {
    prop.views_count = (prop.views_count || 0) + 1;
    saveLocalProperties(items);
  }
}

// User's own listings tracking in browser
export function getMyListingIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MY_LISTINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMyListingId(id: string) {
  if (typeof window === "undefined") return;
  try {
    const ids = getMyListingIds();
    if (!ids.includes(id)) {
      ids.unshift(id);
      localStorage.setItem(MY_LISTINGS_KEY, JSON.stringify(ids));
    }
  } catch (e) {
    console.error("Error saving my listing id:", e);
  }
}

export function removeMyListingId(id: string) {
  if (typeof window === "undefined") return;
  try {
    const ids = getMyListingIds().filter((existing) => existing !== id);
    localStorage.setItem(MY_LISTINGS_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error("Error removing my listing id:", e);
  }
}

/**
 * Upload image to Supabase Storage bucket 'property-images'
 * If not connected, returns a local Base64/Data URL preview
 */
export async function uploadPropertyPhoto(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = `properties/${fileName}`;

      const { data, error } = await supabase.storage
        .from("property-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);
        return publicUrlData.publicUrl;
      }
    } catch (e) {
      console.warn("Supabase photo upload error:", e);
    }
  }

  // Fallback: convert file to Base64 data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
