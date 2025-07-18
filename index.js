// --- Review Radar: Worker & Webhook Server ----------------------------
// - fetch(): Handles web requests. Serves farcaster.json and listens
//   for webhooks to save user notification preferences.
// - scheduled(): Runs every 5 min to find posts and send notifications.

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
// Import the manifest file so we can serve it
import farcasterManifest from './farcaster.json' assert { type: 'json' };


// --- SECTION 1: Configuration & Clients -------------------------------
const POLL_WINDOW_MIN = 5;
const RH_GRAPHQL = 'https://www.researchhub.com/graphql';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


// --- SECTION 2: Main Export (Server Logic) ----------------------------

export default {
  // --------------------------------------------------------------------
  //  SECTION 2A: The `fetch` handler for web requests
  // --------------------------------------------------------------------
  async fetch(request) {
    const url = new URL(request.url);

    // If a client requests the manifest, return it.
    if (request.method === 'GET' && url.pathname === '/farcaster.json') {
      console.log('Serving farcaster.json manifest.');
      return new Response(JSON.stringify(farcasterManifest), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If a Farcaster client sends notification preferences, handle it.
    if (request.method === 'POST' && url.pathname === '/webhook') {
      console.log('Received a webhook request...');
      try {
        const body = await request.json();
        const { fid, notification_token, notification_url } = body;

        if (!fid || !notification_token || !notification_url) {
          console.error('🔴 Webhook Error: Missing required data.');
          return new Response('Invalid request body', { status: 400 });
        }
        
        console.log(`Processing webhook for FID: ${fid}`);
        const { error } = await supabase
          .from('user_prefs')
          .upsert({ 
            fid: fid, 
            notification_token: notification_token,
            notification_url: notification_url
          }, { 
            onConflict: 'fid'
          });

        if (error) {
          console.error('🔴 Supabase error saving notification token:', error);
          return new Response('Database error', { status: 500 });
        }

        console.log(`✅ Successfully saved notification preferences for FID: ${fid}`);
        return new Response('Webhook processed successfully', { status: 200 });

      } catch (err) {
        console.error('🔴 Error processing webhook:', err);
        return new Response('Server error', { status: 500 });
      }
    }
    
    // For all other requests, return a simple homepage message.
    return new Response('Review Radar Worker is running.', { status: 200 });
  },

  // --------------------------------------------------------------------
  //  SECTION 2B: The `scheduled` handler for sending notifications
  // --------------------------------------------------------------------
  async scheduled() {
    console.log(`📡 Starting Review Radar worker...`);
    const since = Date.now() - POLL_WINDOW_MIN * 60_000;

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
    let posts;
    try {
      const rhResp = await fetch(RH_GRAPHQL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: rhQuery }),
      });
      const { data } = await rhResp.json();
      posts = data?.posts || [];
    } catch (fetchError) {
      console.error('🔴 Error fetching from ResearchHub:', fetchError);
      return;
    }

    if (!posts.length) {
      console.log('✅ No new posts found. Worker finished.');
      return;
    }
    console.log(`📄 Found ${posts.length} new posts to process.`);

    const { data: allUserPrefs, error } = await supabase
      .from('user_prefs')
      .select('hubs,editors,keywords,notification_token,notification_url');

    if (error) {
      console.error('🔴 Supabase error fetching preferences:', error);
      return;
    }
    if (!allUserPrefs || allUserPrefs.length === 0) {
        console.log('🤷 No users have set preferences. Worker finished.');
        return;
    }
    
    for (const post of posts) {
      const titleLower = post.title.toLowerCase();
      const matchingUsers = allUserPrefs.filter(user => {
        if (!user.notification_token || !user.notification_url) return false;
        const hubMatch = (user.hubs || []).includes(post.hub);
        const editorMatch = (user.editors || []).includes(post.editor);
        let keywordMatch = false;
        if (user.keywords) {
          const keywords = Array.isArray(user.keywords) ? user.keywords : [user.keywords];
          keywordMatch = keywords.some(k => k && titleLower.includes(k.toLowerCase()));
        }
        return hubMatch || editorMatch || keywordMatch;
      });

      if (matchingUsers.length > 0) {
        const notificationsByUrl = matchingUsers.reduce((acc, user) => {
          if (!acc[user.notification_url]) acc[user.notification_url] = [];
          acc[user.notification_url].push(user.notification_token);
          return acc;
        }, {});

        for (const [url, tokens] of Object.entries(notificationsByUrl)) {
          try {
            console.log(`🚀 Sending notification about "${post.title}" to ${tokens.length} user(s).`);
            await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: post.title,
                body: `${post.hub} • ${post.abstract.slice(0, 80)}…`,
                targetUrl: `https://www.researchhub.com/paper/${post.id}`,
                tokens: tokens,
              }),
            });
            console.log(`✅ Successfully sent notification for post ${post.id}`);
          } catch (pushErr) {
            console.error(`🔴 Push notification error for post ${post.id}:`, pushErr);
          }
        }
      }
    }
    console.log('🎉 Worker finished processing all posts.');
  },
};