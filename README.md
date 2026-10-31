# 🏠 To-Let Baba (toletbaba.in)
### Direct Owner-to-Tenant • Zero Brokerage Local Rentals in India

"To-Let Baba" is a production-grade, highly scalable, mobile-first classifieds and to-let web portal engineered specifically for the Indian rental real estate market. Inspired by the instant connection model of OLX, it connects house owners, flat landlords, PG managers, and tenants directly without any middlemen, brokers, or brokerage commissions.

---

## 🚀 Key Features

### 1. Sticky OLX-Style Header
- **Branding**: "TO-LET BABA" logo with Indian market trust badges.
- **City Selector**: Instant filter across Delhi NCR, Jaipur, Bengaluru, Mumbai, Pune, Lucknow, Hyderabad, Kolkata, Ahmedabad, Chandigarh, Chennai, and custom search.
- **Smart Debounced Search**: Fast query matching title, locality, colony, sector, city, and category.
- **My Listings Hub**: Self-management portal for owners to track active ads, toggle "Rented Out" status, or delete listings.
- **Prominent CTA**: High-converting `+ POST TO-LET` button.

### 2. Horizontal Scrollable Category Pills Bar
- Smooth swipe & desktop arrow navigation across:
  - `All To-Let`
  - `1 RK / Room` (Budget badge)
  - `1 BHK Flat`
  - `2 BHK Flat` (Popular badge)
  - `3+ BHK Flat`
  - `Independent House/Villa` (Kothi)
  - `PG / Co-living` (With Food badge)
  - `Commercial Shop / Office`

### 3. Advanced Multi-Filter Drawer & Sidebar
- **Rent Range Slider**: Interactive slider from ₹2,000 to ₹1,00,000+ with quick-pick chips (< ₹10k, < ₹25k, < ₹50k).
- **Tenant Preference**: Family Only, Bachelors Only, Girls Only, Boys Only, Anyone.
- **Furnishing Status**: Unfurnished, Semi-Furnished, Fully Furnished.
- **Amenities Filter**: Parking, Lift, AC, Balcony, High-Speed WiFi, CCTV, RO Water, Power Backup, 24x7 Security, Modular Kitchen, Washing Machine, Geyser.
- **Sorting Options**: Newest First, Rent: Low to High, Rent: High to Low, Most Viewed.
- **Verified Owners Toggle**: Filter for verified phone numbers.

### 4. High-Converting Property Card
- Multi-photo carousel with photo count indicator (`1/4`).
- Bold rent display (`₹18,500 / mo`) & security deposit breakdown.
- Dual high-converting direct contact buttons:
  1. **"Call Owner"**: Direct phone dialer trigger (`tel:+91...`).
  2. **"WhatsApp"**: One-click direct chat with prefilled property title and reference ID.
- Owner management controls: Mark as "Rented Out" toggle and Delete option.

### 5. Multi-Step "POST A TO-LET" Modal Form
- **Step 1 (Basics)**: Title, Category, Furnishing Status, Tenant Preference, Available From.
- **Step 2 (Financials)**: Monthly Rent (₹), Security Deposit (₹), Maintenance charges (₹).
- **Step 3 (Location)**: City, Locality/Colony, Sub-locality/Landmark, Complete Address, 6-digit Indian PIN code.
- **Step 4 (Amenities & Description)**: Interactive amenities multi-selection and detailed description.
- **Step 5 (Photos)**: Image uploader (1 to 6 photos) connected to Supabase Storage bucket (`property-images`) with live thumbnail previews and quick presets.
- **Step 6 (Contact Info)**: Owner Name, 10-digit Indian Mobile Number (`^[6-9]\d{9}$`), WhatsApp Number with "Same as mobile" sync.
- **Instant Save**: Immediate persistence and optimistic prepend to live feed.

### 6. Property Details View (`/property/[id]`)
- Fullscreen photo lightbox gallery.
- Comprehensive financial breakdown table (Rent, Deposit, Maintenance, Move-In Total).
- Mandatory anti-fraud safety advisory ("Never transfer deposit before physically visiting").
- Sticky floating bottom action bar on mobile devices.
- Similar properties recommendation.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components & Client Actions, TypeScript)
- **Styling**: Tailwind CSS (Custom Indian palette: Deep Navy `#0f172a`, Amber `#f59e0b`, WhatsApp Emerald `#10b981`, Slate `#f8fafc`)
- **Icons**: Lucide React
- **Validation**: React Hook Form + Zod
- **Database & Storage**: Supabase (PostgreSQL with RLS, enums, indexes, and Storage Buckets) + LocalStorage offline-first fallback
- **Currency & Localization**: Indian Rupee (`₹` via `Intl.NumberFormat('en-IN')`)

---

## 🗄️ Supabase Setup & DDL

The database script is located at `supabase/schema.sql`.

To apply it:
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** tab.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. In your `.env.local` file, set:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
*(Note: Even without Supabase credentials configured, To-Let Baba comes with a 100% operational offline fallback layer with realistic seed data and local persistence).*

---

## 🏃 Running the Application

```bash
# Navigate to project directory
cd to-let-baba

# Install dependencies (already installed)
npm install

# Run development server
npm run dev

# Or build & start production server
npm run build
npm start
```

Access portal at: [http://localhost:3000](http://localhost:3000)
