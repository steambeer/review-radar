// app/layout.tsx

// Essential imports for Next.js metadata and basic CSS
import type { Metadata } from "next";
import "./globals.css"; // Assuming you have a basic globals.css file for resets or minimal styles

// Define the Farcaster Manifest data, matching the nested 'frame' structure
const FARCASTER_MANIFEST = {
    // The 'frame' object is now correctly nested here
    "frame": {
        "name": "Test Mini App", // Replace with your desired name
        "version": "vNext", // We will explicitly set this to "vNext" in metadata below
        "iconUrl": "https://rhearn.netlify.app/icon.png", // Your icon URL
        "homeUrl": "https://rhearn.netlify.app", // Your app's home URL
        "imageUrl": "https://rhearn.netlify.app/image.png", // Your frame image URL
        "webhookUrl": "https://radar-worker.fly.dev/webhook", // Your webhook URL
        "description": "A simple Farcaster Mini App test.", // Your app's description
    },
    // You can include other manifest properties here if needed for completeness,
    // but they won't affect the meta tags for the frame.
};

// Export `metadata` to configure the <head> section of your HTML
export const metadata: Metadata = {
    // Standard Open Graph (OG) tags: Important for general sharing previews
    // Now correctly accessing FARCASTER_MANIFEST.frame.property
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

    // Farcaster Frame specific meta tags: These are CRUCIAL for it to be recognized as a frame
    other: {
        "fc:frame": "vNext", // CRITICAL: This tells Farcaster clients it's a frame (overriding manifest.version if different)
        "fc:frame:image": FARCASTER_MANIFEST.frame.imageUrl,
        "fc:frame:post_url": FARCASTER_MANIFEST.frame.webhookUrl,
        "fc:frame:button:1": "Launch App", // A simple button label
        "fc:frame:button:1:action": "post", // The action when the button is clicked (posts to post_url)
    },
};

// Export the default RootLayout component to define the basic HTML structure
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {/* The `children` prop will render the content of your pages here */}
                {children}
            </body>
        </html>
    );
}