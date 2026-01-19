import { createClient } from '@/app/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is used by the Supabase auth flow to exchange
  // a temporary code for a session.
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 'next' is where we want to send the user after successful login
  // Defaults to '/' if not provided
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    // Exchange the code for a session and store it in cookies
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // If we're successful, redirect to the 'next' destination
      // Using origin ensures we stay on the same domain
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If there's an error (e.g., code expired), redirect to an error page
  // or the login page with a clear message
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}