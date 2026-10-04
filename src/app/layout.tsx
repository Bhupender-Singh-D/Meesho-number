import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Check Mobile Number | Customer Verification Portal",
  description:
    "Secure, authorized mobile number verification system with zero plaintext storage, privacy-preserving HMAC-SHA256 matching, and abuse protection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-meesho-200 selection:text-meesho-900">
        {children}
      </body>
    </html>
  );
}
