import { redirect } from 'next/navigation'
import { auth } from '@/app/edgedb'

const { GET, POST } = auth.createAuthRouteHandlers({
  onOAuthCallback({ error, tokenData, isSignUp }) {
    redirect('/')
  },
  onSignout() {
    redirect('/')
  },
  onEmailPasswordSignIn({ error, tokenData }) {
    console.log('onEmailPasswordSignIn', error, tokenData)
    redirect('/')
  },
  onBuiltinUICallback({ error, tokenData, isSignUp }) {
    redirect('/')
  },
})

export { GET, POST }
