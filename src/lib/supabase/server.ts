import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'


export async function createClient(p0: string, p1: string) {

  const cookieStore = await cookies()
  // console.log("cookieStore", cookieStore)
  
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookie= cookieStore.getAll()
          return allCookie
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}