import { createClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const ParamsSchema = z.object({
  code: z.string(),
  next: z.string().optional(),
})

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const { code, next } = ParamsSchema.parse({
    code: searchParams.get('code') || '',
    next: searchParams.get('next') || undefined,
  })
  console.log("hello")
  if (code) {
    const supabase = await createClient()
    console.log("origin", origin)
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next ?? '/dashboard'}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth-code-error`)
}