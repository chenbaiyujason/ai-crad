"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactGA from "react-ga4";
import { useEffect } from "react";
const TRACKING_ID = "G-PHEWGMT68L"; // OUR_TRACKING_ID

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
