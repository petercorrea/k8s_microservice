'use strict';
import jwt from '@fastify/jwt';
import oauthPlugin from '@fastify/oauth2';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import underPressure from '@fastify/under-pressure';
import closeWithGrace from 'close-with-grace';
import 'dotenv/config';
import fastify, { type FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth_routes } from './routes/auth.js';
import { healthchecks_routes } from './routes/healthchecks.js';
import { protected_routes } from './routes/protected.js';
import { public_routes } from './routes/public.js';
import { configure_environment } from './utils/helpers.js';

// Load Configuration
const { ENV } = configure_environment();
const isDev = ENV === 'DEV';

// Instantiate w/ logging and type support
const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);

const options = {
  http2: true,
  https: {
    allowHTTP1: true, // Fallback support for HTTP/1
    key: fs.readFileSync(path.join(DIRNAME, '../server.key')),
    cert: fs.readFileSync(path.join(DIRNAME, '../server.cert')),
  },
  ...(isDev &&
    process.stdout.isTTY && {
      logger: {
        level: isDev ? process.env.LOG_LEVEL : 'info',
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
};

// Schema validation and types
export const app: FastifyInstance =
  fastify(options).withTypeProvider<TypeBoxTypeProvider>();

// JWT
await app.register(jwt, {
  // TODO: change to env var
  secret: 'supersecret',
});

app.decorate('authenticate', async (request: any, reply: any): Promise<any> => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Oauth
await app.register(oauthPlugin.fastifyOauth2, {
  name: 'googleOAuth2',
  userAgent: 'my custom app (v1.0.0)',
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: process.env.CLIENT_ID ?? '',
      secret: process.env.CLIENT_SECRET ?? '',
    },
    auth: oauthPlugin.fastifyOauth2.GOOGLE_CONFIGURATION,
  },
  // The Url to sign in with
  startRedirectPath: '/login/google',
  // URL to which Google will redirect the user after authentication
  callbackUri: `http://localhost:${process.env.PORT}/login/google/callback`,
});

// Swagger
if (process.env.SWAGGER_ENABLED === 'true') {
  await app.register(fastifySwagger);
  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
}

// Load configuration
await app.register(underPressure, {
  // TODO: tune params
  maxEventLoopDelay: 100,
  maxHeapUsedBytes: 2_147_483_648,
  maxRssBytes: 2_147_483_648,
  maxEventLoopUtilization: 0.98,
});

// Routes
await app.register(public_routes);
await app.register(auth_routes);
await app.register(protected_routes);
await app.register(healthchecks_routes);

// Debugging Hooks
// app.addHook('onSend', async (request, reply, payload) => {
//   console.log('Body:', request.body)
//   console.log('Response:', payload)
// })

// Only start the server if this file is run directly
const start = async (): Promise<void> => {
  // Swagger
  await app.ready();
  if (process.env.SWAGGER_ENABLED === 'true') {
    app.swagger();
  }

  app.listen(
    { port: Number(process.env.PORT) ?? 9000, host: '0.0.0.0' },
    (err, address) => {
      if (err != null) {
        app.log.error(err);
        process.exit(1);
      }
      console.log(`Initializing instance...`);
      console.log(`Environment set: ${ENV}`);
      console.log(`Server listening on ${address}`);
    }
  );
};

if (import.meta.url === `file://${process.argv[1]}`) {
  await start();
}

// Graceful Exits
closeWithGrace({ delay: 500 }, async function ({ signal, err, manual }) {
  console.log('Gracefully exiting...');
  if (err != null) {
    console.error(`Error in graceful shutdown: ${err.message}`);
  }
  await app.close();
});

// Export for cluster.js
export default app;
