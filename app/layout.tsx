// The final, correct layout for the Mini App

// We can bring back the original imports
import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

// The viewport setting is good to keep
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

// We can add a simple title and description for regular browsers
export const metadata: Metadata = {
    title: "RH Notifier",
    description: "Get notified about new ResearchHub papers.",
};

// This is the RootLayout component from your original file
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-background">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}