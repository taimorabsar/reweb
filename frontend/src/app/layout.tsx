import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RealEstate - Find Your Dream Property",
    template: "%s | RealEstate",
  },
  description:
    "Find your dream property from thousands of verified listings across India. Search apartments, houses, villas, plots, and commercial properties.",
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
    locale: "en_IN",
    siteName: "RealEstate",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
