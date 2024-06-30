import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const EDGEDB_AUTH_BASE_URL = process.env.EDGEDB_AUTH_BASE_URL

function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url')
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url')
  return { verifier, challenge }
}

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url)

  if (pathname.endsWith('/signin') || pathname.endsWith('/signup')) {
    const { verifier, challenge } = generatePKCE()
    const isSignUp = pathname.endsWith('/signup')

    const redirectUrl = new URL(
      `ui/${isSignUp ? 'signup' : 'signin'}`,
      EDGEDB_AUTH_BASE_URL
    )
    redirectUrl.searchParams.set('challenge', challenge)

    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set('edgedb-pkce-verifier', verifier, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    })

    return response
  }

  if (pathname.endsWith('/callback')) {
    const code = request.nextUrl.searchParams.get('code')
    if (!code) {
      return NextResponse.json(
        { error: 'Missing code parameter' },
        { status: 400 }
      )
    }

    const verifier = request.cookies.get('edgedb-pkce-verifier')?.value
    if (!verifier) {
      return NextResponse.json(
        { error: 'Missing PKCE verifier' },
        { status: 400 }
      )
    }

    const codeExchangeUrl = new URL('token', EDGEDB_AUTH_BASE_URL)
    codeExchangeUrl.searchParams.set('code', code)
    codeExchangeUrl.searchParams.set('verifier', verifier)

    const codeExchangeResponse = await fetch(codeExchangeUrl.href, {
      method: 'GET',
    })

    if (!codeExchangeResponse.ok) {
      const text = await codeExchangeResponse.text()
      return NextResponse.json(
        { error: `Error from auth server: ${text}` },
        { status: 400 }
      )
    }

    const { auth_token } = await codeExchangeResponse.json()
    const response = NextResponse.json({ success: true }, { status: 200 })
    response.cookies.set('edgedb-auth-token', auth_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    })

    return response
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
