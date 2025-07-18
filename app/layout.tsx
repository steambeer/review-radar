// In app/layout.tsx

// A minimal layout for debugging
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <title>RH Notifier</title>
                <meta property="fc:frame" content="vNext" />
                <meta
                    property="fc:frame:image"
                    content="https://rhearn.netlify.app/logo.png"
                />

                {/* --- THIS IS THE FIX --- */}
                {/* Using a standard 'link' button is more reliable. */}
                {/* The client will see the manifest at the target URL and launch the Mini App. */}
                <meta property="fc:frame:button:1" content="Launch RH Notifier" />
                <meta property="fc:frame:button:1:action" content="link" />
                <meta
                    property="fc:frame:button:1:target"
                    content="https://rhearn.netlify.app"
                />
                {/* --- END OF FIX --- */}

            </head>
            <body>{children}</body>
        </html>
    );
}