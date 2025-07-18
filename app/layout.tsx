// In app/layout.tsx
import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.Node;
}>) {
    return (
        <html lang="en">
            <head>
                <title>RH Notifier</title>
                <meta
                    name="description"
                    content="Get notified about new ResearchHub papers."
                />
                {/* CRITICAL FARCASTER META TAGS */}
                <meta property="fc:frame" content="vNext" />
                <meta
                    property="fc:frame:image"
                    content="https://rhearn.netlify.app/logo.png"
                />
                <meta property="fc:frame:button:1" content="Launch RH Notifier" />
                <meta property="fc:frame:button:1:action" content="link" />
                <meta
                    property="fc:frame:button:1:target"
                    content="https://rhearn.netlify.app"
                />
            </head>
            <body className="bg-background">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}