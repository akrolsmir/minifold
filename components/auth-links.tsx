import { auth } from '@/app/edgedb'
import Link from 'next/link'
import e from '@/dbschema/edgeql-js'

export async function AuthLinks() {
  const signInLink = auth.getBuiltinUIUrl()
  const signUpLink = auth.getBuiltinUISignUpUrl()

  const session = auth.getSession()
  const isSignedIn = await session.isSignedIn()

  // Get current user's name if signed in
  const userName = isSignedIn
    ? (await e.select(e.global.current_user.name).run(session.client)) ?? ''
    : ''

  return (
    <div className="flex flex-row gap-4">
      {isSignedIn ? (
        <>
          <span>
            {/* Surface the user's name or id */}
            {userName}
          </span>
          <Link href={auth.getSignoutUrl()}>Sign Out</Link>
        </>
      ) : (
        <>
          <Link href={signInLink}>Sign In</Link>
          <Link href={signUpLink}>Sign Up</Link>
        </>
      )}
    </div>
  )
}
