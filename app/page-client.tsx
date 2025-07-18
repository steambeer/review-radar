'use client';

import { useState, useEffect } from 'react';

// A flexible SDK type that can contain all the properties we need
interface InjectedSdk {
  clientInfo?: {
    clientFid?: number | null;
  };
  actions?: {
    ready: () => void;
  };
}

// An interface for the Farcaster-specific functions
interface Farcaster {
  addMiniApp: () => void;
  sdk?: InjectedSdk;
}

// Update the global Window type to use our improved definitions
declare global {
  interface Window {
    farcaster?: Farcaster;
    onchainkit?: {
      sdk: InjectedSdk;
    };
  }
}

export default function ClientPage() {
  const [hubs, setHubs] = useState<string>('Drug Discovery');
  const [editors, setEditors] = useState<string>('scott-nelson');
  const [keywords, setKW] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isReady, setIsReady] = useState(false); // State to track if ready signal has been sent

  // This function saves the user's topic preferences
  async function savePrefs() {
    setStatus('Saving...');
    const fid = window.onchainkit?.sdk?.clientInfo?.clientFid || 999;

    // --- THIS IS THE FIX ---
    // Signal ready only after we have the FID and are about to take an action.
    if (!isReady) {
      const sdk = window.onchainkit?.sdk || window.farcaster?.sdk;
      if (sdk?.actions?.ready) {
        sdk.actions.ready();
        setIsReady(true); // Ensure we only send the signal once
      }
    }
    // --- END OF FIX ---

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
    } catch (err) {
      if (err instanceof Error) {
        setStatus('❌ Error saving preferences: ' + err.message);
      } else {
        setStatus('❌ An unknown error occurred.');
      }
    }
  }

  // This function handles the notification opt-in flow
  function handleEnableNotifications() {
    // Also signal ready here, in case the user clicks this button first.
    if (!isReady) {
      const sdk = window.onchainkit?.sdk || window.farcaster?.sdk;
      if (sdk?.actions?.ready) {
        sdk.actions.ready();
        setIsReady(true);
      }
    }

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