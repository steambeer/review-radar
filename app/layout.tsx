// A minimal layout for debugging
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <title>Debug Mini App</title>
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="https://rhearn.netlify.app/logo.png" />
                <meta property="fc:frame:button:1" content="Launch App" />
                <meta property="fc:frame:button:1:action" content="launch_miniapp" />
                <meta property="fc:frame:button:1:name" content="RH Notifier" />
                <meta property="fc:frame:button:1:url" content="https://rhearn.netlify.app" />
            </head>
            <body>{children}</body>
        </html>
    );
}