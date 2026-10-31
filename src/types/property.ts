export type PropertyCategory =
  | '1 RK / Room'
  | '1 BHK Flat'
  | '2 BHK Flat'
  | '3+ BHK Flat'
  | 'Independent House/Villa'
  | 'PG / Co-living'
  | 'Commercial Shop / Office';

export type FurnishingStatus = 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';

export type TenantPreference =
  | 'Family Only'
  | 'Bachelors Only'
  | 'Girls Only'
  | 'Boys Only'
  | 'Anyone';

export interface Property {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  category: PropertyCategory;
  rent_amount: number;
  deposit_amount: number;
  maintenance_charges: number;
  furnishing: FurnishingStatus;
  tenant_type: TenantPreference;
  available_from: string;

  city: string;
  locality: string;
  sub_locality?: string | null;
  address: string;
  pincode: string;

  amenities: string[];
  images: string[];
  owner_name: string;
  owner_phone: string;
  whatsapp_number: string;

  is_verified: boolean;
  is_featured: boolean;
  is_active: boolean;
  is_rented_out: boolean;
  views_count: number;
}

export type PropertyFormData = Omit<
  Property,
  'id' | 'created_at' | 'updated_at' | 'is_verified' | 'is_featured' | 'is_active' | 'is_rented_out' | 'views_count'
>;

export interface FilterState {
  city: string;
  searchQuery: string;
  category: PropertyCategory | 'All';
  minRent: number;
  maxRent: number;
  furnishing: FurnishingStatus | 'All';
  tenantType: TenantPreference | 'All';
  amenities: string[];
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  verifiedOnly: boolean;
}

export const POPULAR_CITIES = [
  'Delhi NCR',
  'Jaipur',
  'Bengaluru',
  'Mumbai',
  'Pune',
  'Lucknow',
  'Hyderabad',
  'Ahmedabad',
  'Chandigarh',
  'Kolkata',
  'Chennai',
  'Indore',
] as const;

export const CATEGORIES_LIST: PropertyCategory[] = [
  '1 RK / Room',
  '1 BHK Flat',
  '2 BHK Flat',
  '3+ BHK Flat',
  'Independent House/Villa',
  'PG / Co-living',
  'Commercial Shop / Office',
];

export const COMMON_AMENITIES = [
  'Car Parking',
  'Bike Parking',
  'Lift / Elevator',
  'Air Conditioning',
  'Balcony / Terrace',
  'High-Speed WiFi',
  'CCTV Surveillance',
  'RO Drinking Water',
  'Power Backup',
  '24x7 Security Guard',
  'Modular Kitchen',
  'Washing Machine',
  'Geyser / Water Heater',
  'Refrigerator',
  'Gated Society',
  'Near Metro Station',
] as const;
