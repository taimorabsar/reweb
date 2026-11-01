import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "RealEstate - Find Your Dream Property",
    template: "%s | RealEstate",
  },
  description:
    "Find your dream property from thousands of verified listings across Pakistan. Search apartments, houses, villas, plots, and commercial properties.",
  keywords: [
    "real estate",
    "property",
    "buy property",
    "rent property",
    "apartment",
    "house",
    "villa",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "RealEstate",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}