// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Imports a font
import "./globals.css"; // Imports global styles

const inter = Inter({ subsets: ["latin"] });

// --- Part 1: Metadata Definition (for the <head> section) ---
const FARCASTER_MANIFEST = { /* ... your manifest data ... */ };
export const metadata: Metadata = {
    title: FARCASTER_MANIFEST.frame.name,
    description: FARCASTER_MANIFEST.frame.description,
    icons: { icon: FARCASTER_MANIFEST.frame.iconUrl },
    openGraph: { /* ... og tags ... */ },
    other: { /* ... fc:frame tags, including "vNext" ... */ },
};

// --- Part 2: Root Layout Component (for the <html> and <body>) ---
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body> {/* Renders your actual page content */}
        </html>
    );
}