'use strict'
import jwt from '@fastify/jwt'
import oauthPlugin from '@fastify/oauth2'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import 'dotenv/config'
import fastify, { type FastifyInstance } from 'fastify'
import routes from './routes/routes.js'

// Instantiate w/ logging and type support
const app: FastifyInstance = fastify({
  logger: {
    level: 'trace'
  }
}).withTypeProvider<TypeBoxTypeProvider>()

// Oauth and JWT plugins
await app.register(jwt, {
  secret: 'supersecret'
})

await app.register(oauthPlugin.fastifyOauth2, {
  name: 'googleOAuth2',
  userAgent: 'my custom app (v1.0.0)',
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: process.env.CLIENT_ID ?? '',
      secret: process.env.CLIENT_SECRET ?? ''
    },
    auth: oauthPlugin.fastifyOauth2.GOOGLE_CONFIGURATION
  },
  // The Url to sign in with
  startRedirectPath: '/login/google',
  // URL to which Google will redirect the user after authentication
  callbackUri: `http://localhost:${process.env.PORT}/login/google/callback`
})

app.decorate('authenticate', async (request: any, reply: any): Promise<any> => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
})

// Routes
await app.register(routes)

// Debugging
// app.addHook('onRequest', async (request, reply) => {
//   // request body is always undefined
//   console.log('Request:', request)
// })

// app.addHook('onSend', async (request, reply, payload) => {
//   console.log('Body:', request.body)
//   console.log('Response:', payload)
// })

// Fire up server
const start = (): void => {
  app.listen({ port: Number(process.env.PORT) ?? 9000 }, (err, address) => {
    if (err != null) {
      app.log.error(err)
      process.exit(1)
    }
    console.log(`Server listening on ${address}`)
  })
}
start()
