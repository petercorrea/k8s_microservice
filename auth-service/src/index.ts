// Add this to your imports
import oauthPlugin from '@fastify/oauth2'
import 'dotenv/config'
import Fastify from 'fastify'

import { type OAuth2Namespace } from '@fastify/oauth2'

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace
  }
}

const fastify = Fastify({
  logger: true
})

await fastify.register(oauthPlugin, {
  name: 'googleOAuth2',
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: process.env.CLIENT_ID ?? '',
      secret: process.env.CLIENT_SECRET ?? ''
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION
  },
  // The Url to sign in with
  startRedirectPath: '/login/google',
  // URL to which Google will redirect the user after authentication
  callbackUri: `http://localhost:${process.env.PORT}/login/google/callback`
})

// Add a route to handle the callback
fastify.get('/login/google/callback', async function (request, reply) {
  const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
  // if later you need to refresh the token you can use
  // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

  await reply.send({ access_token: token.access_token })
})

try {
  await fastify.listen({ port: Number(process.env.PORT) ?? 9000 })
  console.log(`Server listening on ${fastify.server.address()?.port}`)
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
