import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Viewport } from "next"; // We only need Viewport from here now
import "./globals.css";
import { Providers } from "./providers";

// This viewport export is correct and can stay.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// The problematic `generateMetadata` function has been completely removed.

// This is the updated RootLayout component.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Basic page metadata */}
        <title>Review Radar Settings</title>
        <meta
          name="description"
          content="Get notified about new ResearchHub posts."
        />

        {/* Farcaster / Mini App Meta Tags with the correct 'property' attribute.
          This block directly injects the exact HTML needed for validation.
        */}
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content="https://rhearn.netlify.app/logo.png"
        />
        <meta
          property="fc:frame:button:1"
          content="Launch Review Radar"
        />
        <meta
          property="fc:frame:button:1:action"
          content="launch_miniapp"
        />
        <meta property="fc:frame:button:1:name" content="Review Radar" />
        <meta
          property="fc:frame:button:1:url"
          content="https://rhearn.netlify.app"
        />
      </head>
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}