/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

export default function Home() {
  const [hubs, setHubs] = useState<string>('Drug Discovery');
  const [editors, setEditors] = useState<string>('scott-nelson');
  const [keywords, setKW] = useState<string>('');
  const [status, setStatus] = useState<string>('');   // feedback text

  // ⬇⬇⬇  savePrefs now grabs the wallet‑injected FID (falls back to 999 in a browser) ⬇⬇⬇
  async function savePrefs() {
    const fid =
      (typeof window !== 'undefined' &&
        (window as any)?.onchainkit?.sdk?.clientInfo?.clientFid) || 999;

    try {
      const res = await fetch('/api/savePrefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid,
          hubs: hubs.split(','),
          editors: editors.split(','),
          keywords,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      setStatus(
        '✅ Preferences saved! You will receive notifications once the mini‑app runs in Wallet.'
      );
    } catch (err: any) {
      setStatus('❌ Error saving preferences: ' + err.message);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Review Radar Settings
      </h1>

      {/* Hubs field */}
      <label style={{ display: 'block', marginBottom: 16 }}>
        Hubs (comma-separated)
        <input
          value={hubs}
          onChange={(e) => setHubs(e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: 8,
            marginTop: 4,
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
      </label>

      {/* Editors field */}
      <label style={{ display: 'block', marginBottom: 16 }}>
        Editors (comma-separated)
        <input
          value={editors}
          onChange={(e) => setEditors(e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: 8,
            marginTop: 4,
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
      </label>

      {/* Keywords field */}
      <label style={{ display: 'block', marginBottom: 24 }}>
        Keywords (optional)
        <input
          value={keywords}
          onChange={(e) => setKW(e.target.value)}
          placeholder="e.g. CRISPR, macrolide"
          style={{
            display: 'block',
            width: '100%',
            padding: 8,
            marginTop: 4,
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
      </label>

      {/* Save button */}
      <button
        onClick={savePrefs}
        style={{
          backgroundColor: '#2563eb',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: 6,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Save / Enable notifications
      </button>

      {/* feedback */}
      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </main>
  );
}
