import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const supabase = createRouteHandlerClient<Database>({ cookies });

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error: any) {
      console.log(error);
      return NextResponse.redirect(requestUrl.origin);
    }
  }
  // // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}