'use strict'
import jwt from '@fastify/jwt'
import oauthPlugin from '@fastify/oauth2'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import dotenv from 'dotenv'
import 'dotenv/config'
import fastify, { type FastifyInstance } from 'fastify'
import path from 'path'
import routes from './routes/routes.js'

// Load Configuration
const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });
const isDev = process.env.NODE_ENV === 'dev';

// Instantiate w/ logging and type support

const logger = {
  logger: {
    level: isDev ? process.env.LOG_LEVEL : 'info',
    ...(isDev && {
      transport: {
        target: 'pino-pretty',
      },
    }),
  },
};

const app: FastifyInstance = fastify(logger).withTypeProvider<TypeBoxTypeProvider>()

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

// Swagger
if (process.env.SWAGGER_ENABLED === 'true') {
  await app.register(fastifySwagger)
  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
  })
}

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

// Swagger
if (process.env.SWAGGER_ENABLED === 'true') {
  await app.ready()
  app.swagger()
}
