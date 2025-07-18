import type { Metadata } from 'next';
import ClientPage from './page-client'; // Import the interactive part of your page

// This object tells Farcaster clients how to embed your Mini App
export const metadata: Metadata = {
  title: 'Review Radar Settings',
  description: 'Get notified about new ResearchHub posts.',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://rhearn.netlify.app/logo.png',
    'fc:frame:button:1': 'Launch Review Radar',
    'fc:frame:button:1:action': 'launch_miniapp',
    'fc:frame:button:1:name': 'Review Radar',
    'fc:frame:button:1:url': 'https://rhearn.netlify.app',
  },
};

// This is the main page component that renders the client part
export default function Page() {
  return <ClientPage />;
}