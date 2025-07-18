/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

export default function Home() {
  const [hubs, setHubs] = useState<string>('Drug Discovery');
  const [editors, setEditors] = useState<string>('scott-nelson');
  const [keywords, setKW] = useState<string>('');
  const [status, setStatus] = useState<string>(''); // feedback text

  // This function saves the user's topic preferences.
  async function savePrefs() {
    setStatus('Saving...');
    const fid =
      (typeof window !== 'undefined' &&
        (window as any)?.onchainkit?.sdk?.clientInfo?.clientFid) || 999;

    try {
      // NOTE: This requires a backend API route at /api/savePrefs
      const res = await fetch('/api/savePrefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid,
          hubs: hubs.split(',').map(h => h.trim()), // Trim whitespace
          editors: editors.split(',').map(e => e.trim()),
          keywords,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      setStatus('✅ Preferences saved!');
    } catch (err: any) {
      setStatus('❌ Error saving preferences: ' + err.message);
    }
  }

  // ⬇⬇⬇ NEW FUNCTION ⬇⬇⬇
  // This function handles the notification opt-in flow.
  function handleEnableNotifications() {
    if (window.farcaster && window.farcaster.addMiniApp) {
      setStatus('Please approve in the prompt to enable notifications...');
      // This function prompts the user to add the Mini App and approve notifications.
      // If they approve, the client will call your backend webhook.
      window.farcaster.addMiniApp();
    } else {
      alert('This feature is only available within a Farcaster-enabled app.');
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Review Radar Settings
      </h1>

      {/* --- Form fields for hubs, editors, keywords (no changes here) --- */}
      <label style={{ display: 'block', marginBottom: 16 }}>
        Hubs (comma-separated)
        <input value={hubs} onChange={(e) => setHubs(e.target.value)} style={{ ...}} />
      </label>
      <label style={{ display: 'block', marginBottom: 16 }}>
        Editors (comma-separated)
        <input value={editors} onChange={(e) => setEditors(e.target.value)} style={{ ...}} />
      </label>
      <label style={{ display: 'block', marginBottom: 24 }}>
        Keywords (optional)
        <input value={keywords} onChange={(e) => setKW(e.target.value)} style={{ ...}} />
      </label>
      {/* --- End of form fields --- */}

      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* Save button */}
        <button onClick={savePrefs} style={{ ...}}>
          Save Preferences
        </button>

        {/* ⬇⬇⬇ NEW BUTTON ⬇⬇⬇ */}
        <button onClick={handleEnableNotifications} style={{ ...}}>
          Enable Notifications
        </button>
      </div>

      {/* feedback */}
      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </main>
  );
}