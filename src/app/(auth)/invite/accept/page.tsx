import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

import { AcceptInviteForm } from './AcceptInviteForm'

export default async function AcceptInvitePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const admin = createAdminClient()
  // First check for a non-expired invite regardless of accepted_at so we can
  // distinguish "already accepted" (Google auto-complete) from "not found".
  const { data: invite } = await admin
    .from('invites')
    .select('id, accepted_at')
    .eq('email', user.email!.toLowerCase())
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (!invite) redirect('/login?error=invalid_link')

  // Invite was already auto-completed when the user signed in with Google —
  // they're already in their org, just send them to the dashboard.
  if (invite.accepted_at) redirect('/dashboard')

  return (
    <Suspense>
      <AcceptInviteForm />
    </Suspense>
  )
}
