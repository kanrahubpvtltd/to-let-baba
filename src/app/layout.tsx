import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "To-Let Baba | Zero Brokerage Direct Owner Rentals & Flats in India",
  description:
    "Specialized OLX-style classifieds portal for local house rentals, flats, 1 RK rooms, PGs, and commercial spaces across Delhi NCR, Jaipur, Bengaluru, Mumbai, Pune, Lucknow. Direct Owner-to-Tenant with Zero Brokerage.",
  keywords: [
    "To-Let",
    "House for rent",
    "Flats for rent",
    "Zero Brokerage",
    "PG in Bengaluru",
    "Flats in Delhi NCR",
    "Rooms in Jaipur",
    "Direct Owner Rental",
    "OLX rentals India",
    "Commercial shop rent",
  ],
  authors: [{ name: "To-Let Baba" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "To-Let Baba • Zero Brokerage Local Rentals in India",
    description:
      "Find flats, 1 RK, rooms, PGs, and shops directly from verified owners with zero brokerage and instant WhatsApp chat.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-navy-950`}
      >
        {children}
      </body>
    </html>
  );
}
