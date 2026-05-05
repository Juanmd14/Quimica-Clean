import 'server-only'
import { createClient } from '@supabase/supabase-js'

let _client: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _client
}

// backwards compat — prefer getSupabaseAdmin() in new code
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get: (_, prop) => getSupabaseAdmin()[prop as keyof ReturnType<typeof createClient>],
})