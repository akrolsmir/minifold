import Link from 'next/link'

export function AuthLinks() {
  return (
    <div>
      <Link href="/api/auth/signin">Sign In</Link>
      <Link href="/api/auth/signup">Sign Up</Link>
    </div>
  )
}
