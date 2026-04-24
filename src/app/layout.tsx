import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store",
  description: "Mall web ecommerce store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      {/* 1. Head is usually handled by Next.js Metadata API, 
             but if you had a <head> tag, it would go here. 
      */}
      <body className="min-h-full flex flex-col">
        {/* 2. ALL visible content, including the header, must be inside the body */}
        <header>
          <Navbar />
        </header>
        
        <main>{children}</main>
        
        {/* You can also put a <footer> here */}
      </body>
    </html>
  )
}
