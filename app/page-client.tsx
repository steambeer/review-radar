'use client';

import { useState, useEffect } from 'react';

// Define a type for the Farcaster object that gets injected into the window
interface Farcaster {
  addMiniApp: () => void;
  sdk?: {
    actions: {
      ready: () => void;
    };
  };
}

// Tell TypeScript that our window object might have these properties
declare global {
  interface Window {
    farcaster?: Farcaster;
    onchainkit?: any; // Keep onchainkit typed as 'any' for simplicity
  }
}

// Note: The component is named ClientPage to match the import in `app/page.tsx`
export default function ClientPage() {
  const [hubs, setHubs] = useState<string>('Drug Discovery');
  const [editors, setEditors] = useState<string>('scott-nelson');
  const [keywords, setKW] = useState<string>('');
  const [status, setStatus] = useState<string>(''); // For user feedback

  // This hook runs once when the app loads to signal it's ready
  useEffect(() => {
    const sdk = window.onchainkit?.sdk || window.farcaster?.sdk;
    if (sdk && sdk.actions && sdk.actions.ready) {
      sdk.actions.ready();
    }
  }, []); // The empty array ensures this runs only once on mount

  // This function saves the user's topic preferences
  async function savePrefs() {
    setStatus('Saving...');
    const fid =
      (typeof window !== 'undefined' &&
        window.onchainkit?.sdk?.clientInfo?.clientFid) || 999;

    try {
      const res = await fetch('/api/savePrefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid,
          hubs: hubs.split(',').map((h) => h.trim()),
          editors: editors.split(',').map((e) => e.trim()),
          keywords,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      setStatus('✅ Preferences saved!');
    } catch (err: any) {
      setStatus('❌ Error saving preferences: ' + err.message);
    }
  }

  // This function handles the notification opt-in flow
  function handleEnableNotifications() {
    if (window.farcaster && window.farcaster.addMiniApp) {
      setStatus('Please approve in the prompt to enable notifications...');
      window.farcaster.addMiniApp();
    } else {
      alert('This feature is only available within a Farcaster-enabled app.');
    }
  }

  // Shared style objects for cleaner JSX
  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: 8,
    marginTop: 4,
    border: '1px solid #ccc',
    borderRadius: 4,
  };

  const buttonStyle = {
    flex: 1,
    backgroundColor: '#0052ff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: 24, fontFamily: '-apple-system, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        RH Notifier Settings
      </h1>

      <label style={{ display: 'block', marginBottom: 16 }}>
        Hubs (comma-separated)
        <input value={hubs} onChange={(e) => setHubs(e.target.value)} style={inputStyle} />
      </label>

      <label style={{ display: 'block', marginBottom: 16 }}>
        Editors (comma-separated)
        <input value={editors} onChange={(e) => setEditors(e.target.value)} style={inputStyle} />
      </label>

      <label style={{ display: 'block', marginBottom: 24 }}>
        Keywords (optional)
        <input value={keywords} onChange={(e) => setKW(e.target.value)} placeholder="e.g. CRISPR, macrolide" style={inputStyle} />
      </label>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={savePrefs} style={buttonStyle}>
          Save Preferences
        </button>

        <button onClick={handleEnableNotifications} style={buttonStyle}>
          Enable Notifications
        </button>
      </div>

      {status && <p style={{ marginTop: 16, color: '#333' }}>{status}</p>}
    </main>
  );
}