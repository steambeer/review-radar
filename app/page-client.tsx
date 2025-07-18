'use client';

import { useState, useEffect } from 'react';

// --- TYPE DEFINITIONS TO FIX THE ERRORS ---

// Define a minimal type for the part of OnchainKit we are using
interface OnchainKit {
  sdk: {
    clientInfo?: {
      clientFid?: number | null;
    };
  };
}

// Define a type for the Farcaster object
interface Farcaster {
  addMiniApp: () => void;
  sdk?: {
    actions: {
      ready: () => void;
    };
  };
}

// Update the global Window type without using 'any'
declare global {
  interface Window {
    farcaster?: Farcaster;
    onchainkit?: OnchainKit;
  }
}

export default function ClientPage() {
  const [hubs, setHubs] = useState<string>('Drug Discovery');
  const [editors, setEditors] = useState<string>('scott-nelson');
  const [keywords, setKW] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const sdk = window.onchainkit?.sdk || window.farcaster?.sdk;
    if (sdk?.actions?.ready) {
      sdk.actions.ready();
    }
  }, []);

  async function savePrefs() {
    setStatus('Saving...');
    const fid = window.onchainkit?.sdk?.clientInfo?.clientFid || 999;

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
    } catch (err) { // Using type-safe error handling instead of 'any'
      if (err instanceof Error) {
        setStatus('❌ Error saving preferences: ' + err.message);
      } else {
        setStatus('❌ An unknown error occurred.');
      }
    }
  }

  function handleEnableNotifications() {
    if (window.farcaster?.addMiniApp) {
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