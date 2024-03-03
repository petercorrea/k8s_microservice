'use strict';
import cookie from '@fastify/cookie';
import jwt, { type VerifyPayloadType } from '@fastify/jwt';
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
import {
  AUTH_TOKEN_COOKIE_CONFIG,
  REFRESH_TOKEN_COOKIE_CONFIG,
  create_auth_token_config,
  create_refresh_token_config,
} from './constants/constants.js';
import { auth_routes } from './routes/auth.js';
import { healthchecks_routes } from './routes/healthchecks.js';
import { protected_routes } from './routes/protected.js';
import { public_routes } from './routes/public.js';
import { type IGoogleUserInfo } from './types/auth.js';
import { configure_environment } from './utils/helpers.js';

// Load Configuration
const { env } = configure_environment();
const is_dev = env === 'DEV';

// Err if envs are not set
if (process.env.COOKIE_SECRET == null || process.env.JWT_SECRET == null) {
  throw Error('Please configure environment');
}
// Instantiate w/ logging, schema validation and type support
const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);
const logging_options = {
  http2: true,
  https: {
    allowHTTP1: true, // Fallback support for HTTP/1
    key: fs.readFileSync(path.join(DIRNAME, '../server.key')),
    cert: fs.readFileSync(path.join(DIRNAME, '../server.cert')),
  },
  ...(is_dev &&
    process.stdout.isTTY && {
      logger: {
        level: is_dev ? process.env.LOG_LEVEL : 'info',
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
};

export const app: FastifyInstance =
  fastify(logging_options).withTypeProvider<TypeBoxTypeProvider>();

// Cookies
await app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  hook: 'onRequest',
});

// JWT
await app.register(jwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: 'auth_token',
    signed: true,
  },
});

// Token validation
app.decorate('authenticate', async (request: any, reply: any): Promise<any> => {
  try {
    // validate auth token
    const AUTH_TOKEN: string = request.cookies['__Host-auth_token'];
    // this throws
    app.jwt.verify(AUTH_TOKEN);
  } catch (err: any) {
    // jwt is expired
    if (err.message.slice(0, 21) === 'The token has expired') {
      // validate refresh token
      const REFRESH_TOKEN: string = request.cookies['__Host-refresh_token'];
      if (REFRESH_TOKEN == null) {
        return reply.send({ message: 'No refresh token' });
      }
      const decoded: VerifyPayloadType & IGoogleUserInfo =
        app.jwt.verify(REFRESH_TOKEN);

      // get user info
      const { id, email, given_name, family_name, picture } = decoded;

      // administer new auth token
      const { config: auth_token_config, expiry: auth_token_expiry } =
        create_auth_token_config(id, email, given_name, family_name, picture);
      const ACCESS_TOKEN = await reply.jwtSign(
        auth_token_config,
        auth_token_expiry
      );

      // administer new refresh token
      const { config: refresh_token_config, expiry: refresh_token_expiry } =
        create_refresh_token_config(
          id,
          email,
          given_name,
          family_name,
          picture
        );
      const NEW_REFRESH_TOKEN = await reply.jwtSign(
        refresh_token_config,
        refresh_token_expiry
      );

      // set cookies
      return reply
        .setCookie('__Host-auth_token', ACCESS_TOKEN, AUTH_TOKEN_COOKIE_CONFIG)
        .setCookie(
          '__Host-refresh_token',
          NEW_REFRESH_TOKEN,
          REFRESH_TOKEN_COOKIE_CONFIG
        )
        .send({ message: 'New tokens' });
    }
    // unknown failure
    return reply.send({ message: 'Token refresh failed' });
  }
  // valid token, proceed to route logic
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
  callbackUri: `https://localhost:${process.env.PORT}/login/google/callback`,
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
      onRequest: function (request: any, reply: any, next: () => void) {
        next();
      },
      preHandler: function (request: any, reply: any, next: () => void) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header: any) => header,
    transformSpecification: (swaggerObject: any, request: any, reply: any) => {
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
      console.log(`Environment set: ${env}`);
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
