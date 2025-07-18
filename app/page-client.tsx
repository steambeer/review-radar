'use client';

import { useState, useEffect } from 'react';

// --- TYPE DEFINITIONS ---
interface InjectedSdk {
  clientInfo?: { clientFid?: number | null; };
  actions?: { ready: () => void; };
}
interface Farcaster {
  addMiniApp: () => void;
  sdk?: InjectedSdk;
}
declare global {
  interface Window {
    farcaster?: Farcaster;
    onchainkit?: { sdk: InjectedSdk; };
  }
}

export default function ClientPage() {
  const [hubs, setHubs] = useState<string>('Drug Discovery');
  const [editors, setEditors] = useState<string>('scott-nelson');
  const [keywords, setKW] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  // --- UPDATED FOR DEBUGGING ---
  useEffect(() => {
    console.log('--- RH Notifier Debug ---');
    console.log('Component mounted. Starting to look for SDK...');

    let attempts = 0;
    const maxAttempts = 50; // Try for 5 seconds

    const checkForSdk = () => {
      const sdk = window.onchainkit?.sdk || window.farcaster?.sdk;

      if (sdk?.actions?.ready) {
        console.log('✅ SUCCESS: SDK with .actions.ready() found!', sdk);
        sdk.actions.ready();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkForSdk, 100);
      } else {
        console.error('❌ FAILURE: SDK with .actions.ready() not found after 5 seconds.');
        // Log the final state of the objects if we fail
        console.log('Final window.onchainkit object:', window.onchainkit);
        console.log('Final window.farcaster object:', window.farcaster);
      }
    };

    checkForSdk();
  }, []);

  // --- The rest of your component remains the same ---
  async function savePrefs() { /* ... */ }
  function handleEnableNotifications() { /* ... */ }
  const inputStyle = { /* ... */ };
  const buttonStyle = { /* ... */ };

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: 24, fontFamily: '-apple-system, sans-serif' }}>
      {/* ... your full JSX ... */}
    </main>
  );
}