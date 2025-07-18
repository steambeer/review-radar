// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Your provided Farcaster manifest details
const FARCASTER_MANIFEST = {
    "frame": {
        "name": "test",
        "version": "1",
        "iconUrl": "https://rhearn.netlify.app/icon.png",
        "homeUrl": "https://rhearn.netlify.app",
        "imageUrl": "https://rhearn.netlify.app/image.png",
        "splashImageUrl": "https://rhearn.netlify.app/splash.png", // Not directly used in meta tags
        "splashBackgroundColor": "#6200EA", // Not directly used in meta tags
        "webhookUrl": "https://radar-worker.fly.dev/webhook",
        "subtitle": "test", // Not directly used in meta tags
        "description": "test",
        "primaryCategory": "productivity" // Not directly used in meta tags
    },
    // accountAssociation details are for the manifest itself, not meta tags
    "accountAssociation": {
        "header": "eyJmaWQiOjIxMjAwMSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDYzMmEwNWZkNjc5NDRiNzA5ZkNFYzFCNDBjYzVFM2QzYWM0NWNGYUMifQ",
        "payload": "eyJkb21haW4iOiJyaGVhcm4ubmV0bGlmeS5hcHAifQ",
        "signature": "H7jnvtox1MJTPoiQHVwRI9bTSkiMw4LknyweNJdwWooMwCeKRO/eveYbEUcxH+7ySMZiV0NpsQwlN0ornQYX0hw="
    }
};

export const metadata: Metadata = {
    // Standard Open Graph meta tags for general web sharing
    title: FARCASTER_MANIFEST.frame.name,
    description: FARCASTER_MANIFEST.frame.description,
    icons: {
        icon: FARCASTER_MANIFEST.frame.iconUrl,
    },
    openGraph: {
        title: FARCASTER_MANIFEST.frame.name,
        description: FARCASTER_MANIFEST.frame.description,
        images: [{ url: FARCASTER_MANIFEST.frame.imageUrl }],
        url: FARCASTER_MANIFEST.frame.homeUrl,
    },
    // Farcaster Frame specific meta tags
    other: {
        "fc:frame": FARCASTER_MANIFEST.frame.version, // Matches "version": "1" from your manifest
        "fc:frame:image": FARCASTER_MANIFEST.frame.imageUrl,
        "fc:frame:post_url": FARCASTER_MANIFEST.frame.webhookUrl, // Where button presses will be sent
        "fc:frame:button:1": "Launch App", // A default button title, as it's not specified in your manifest
        "fc:frame:button:1:action": "post", // The action when the button is clicked
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}