import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shubham Kangune - Automotive Plastic Trim Design Engineer",
  description:
    "Portfolio of Shubham Kangune - Automotive Plastic Trim Design Engineer specializing in CATIA V5, Interior & Exterior Trims, and manufacturing optimization.",
  icons: {
    icon: [
      { url: "/favicon.webp", type: "image/png" },
    ],
    shortcut: "/favicon.webp",
    apple: "/favicon.webp",
  },
  openGraph: {
    title: "Shubham Kangune - Automotive Plastic Trim Design Engineer",
    description:
      "Portfolio of Shubham Kangune - Automotive Plastic Trim Design Engineer specializing in CATIA V5, Interior & Exterior Trims, and manufacturing optimization.",
    images: ["/opengraph.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${rajdhani.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
