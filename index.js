// --- Review Radar worker -----------------------------------------------
// Runs every 5 min (configured in fly.toml’s schedule) to:
// 1. Fetch new ResearchHub posts
// 2. Find subscribers who care (by hub / editor / keyword)
// 3. Push a notification via Neynar

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
// Use createRequire to load the CJS module directly
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 1) Load the raw module
const neynarModule = require('@neynar/nodejs-sdk');

// 2) Debug: print exactly what keys it exports
console.log('⏱️ Neynar module exports:', Object.keys(neynarModule));

// 3) Destructure whatever you need (you’ll adjust these names once we see the real keys)
const { NeynarAPIClient, Configuration } = neynarModule;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Build a Neynar configuration and client
const neynarConfig = new Configuration({ apiKey: process.env.NEYNAR_KEY });
const neynar = new NeynarAPIClient(neynarConfig);

// Poll 5 min back so overlapping runs don’t miss anything
const POLL_WINDOW_MIN = 5;
const RH_GRAPHQL = 'https://www.researchhub.com/graphql';

export default {
  async scheduled() {
    const since = Date.now() - POLL_WINDOW_MIN * 60_000;

    // 1) Grab recent posts
    const rhQuery = `
      query {
        posts(since: ${Math.floor(since / 1000)}) {
          id
          title
          abstract
          hub
          editor
        }
      }
    `;
    const rhResp = await fetch(RH_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: rhQuery }),
    });
    const { data } = await rhResp.json();
    if (!data?.posts?.length) {
      console.log('No new posts');
      return;
    }

    for (const post of data.posts) {
      // 2) Who subscribes to this hub/editor/keyword?
      const { data: rows, error } = await supabase
        .from('user_prefs')
        .select('fid,hubs,editors,keywords');

      if (error) {
        console.error('Supabase error', error);
        continue;
      }

      const targets = rows
        .filter((r) =>
          (r.hubs || []).includes(post.hub) ||
          (r.editors || []).includes(post.editor) ||
          (r.keywords && post.title.toLowerCase().includes(r.keywords.toLowerCase()))
        )
        .map((r) => r.fid);

      if (!targets.length) continue;

      // 3) Push notification via Neynar
      try {
        await neynar.publishFrameNotifications({
          targetFids: targets,
          notification: {
            title: post.title,
            body: `${post.hub} • ${post.abstract.slice(0, 80)}…`,
            target_url: `https://www.researchhub.com/paper/${post.id}`,
          },
        });
        console.log(`Pushed "${post.title}" to ${targets.length} FIDs`);
      } catch (pushErr) {
        console.error('Neynar push error', pushErr);
      }
    }
  },
};
