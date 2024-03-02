'use strict'
import jwt from '@fastify/jwt'
import oauthPlugin from '@fastify/oauth2'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import underPressure from "@fastify/under-pressure"
import closeWithGrace from 'close-with-grace'
import dotenv from 'dotenv'
import 'dotenv/config'
import fastify, { type FastifyInstance } from 'fastify'
import fs from "fs"
import path from 'path'
import { fileURLToPath } from 'url'
import routes from './routes/routes.js'
import { getENV } from './utils/helpers.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Configuration
const env = getENV()
const envPath = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: envPath });
const isDev = env === 'DEV';

// Instantiate w/ logging and type support
const options = {
  http2: true,
  https: {
    allowHTTP1: true, // Fallback support for HTTP/1
    key: fs.readFileSync(path.join(__dirname, '../server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../server.cert'))
  },
  ...(isDev && process.stdout.isTTY && {
    logger: {
      level: isDev ? process.env.LOG_LEVEL : 'info',
      transport: {
        target: 'pino-pretty',
      },
    }
  }),
};

export const app: FastifyInstance = fastify(options).withTypeProvider<TypeBoxTypeProvider>()

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

app.register(underPressure, {
  maxEventLoopDelay: 100,
  maxHeapUsedBytes: 2_147_483_648,
  maxRssBytes: 2_147_483_648,
  maxEventLoopUtilization: 0.98
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

// Only start the server if this file is run directly
const start = async (): Promise<void> => {
  // Swagger
  await app.ready()
  if (process.env.SWAGGER_ENABLED === 'true') {
    app.swagger()
  }
  
  await app.listen({ port: Number(process.env.PORT) ?? 9000, host: '0.0.0.0' }, (err, address) => {
    if (err != null) {
      app.log.error(err)
      process.exit(1)
    }
    console.log(`Env: ${getENV()}, PORT: ${process.env.PORT}`)
    console.log(`Server listening on ${address}`)
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

closeWithGrace({ delay: 500 }, async function ({ signal, err, manual }) {
  console.log("Gracefully exiting...")
  if (err) {
    console.error(err)
  }
  await app.close()
})

// Export for cluster.js
export default app;
