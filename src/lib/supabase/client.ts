import { createBrowserClient } from '@supabase/ssr'

// Module-level singleton — one client per browser context
let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // Replace the Web Locks API lock with a no-op to prevent
          // lock acquisition timeouts in dev and after navigation.
          // Safe because this is a singleton — only one client exists.
          lock: (_name, _acquireTimeout, fn) => fn(),
        },
      }
    )
  }
  return client
}
