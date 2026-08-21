import { createClient } from '@supabase/supabase-js';

/* ============================================================
   SYNCHRO — Supabase Client Singleton & Graceful Offline Fallback
   Reads project URL and anon key from Vite env vars.
   If valid credentials are provided, connects to Supabase.
   If environment variables are missing or placeholders, gracefully returns null
   so the application operates cleanly in local/demo mode without WebSocket errors.
   ============================================================ */

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidSupabase = !!(
  rawUrl &&
  rawKey &&
  !rawUrl.includes('your-project') &&
  !rawUrl.includes('placeholder') &&
  !rawKey.includes('your-anon-key') &&
  rawUrl.startsWith('https://')
);

if (!isValidSupabase) {
  console.info('[Synchro] Operating in Offline Demo Mode (Realtime Database Subscription Disabled).');
}

export const supabase = isValidSupabase
  ? createClient(rawUrl, rawKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;
