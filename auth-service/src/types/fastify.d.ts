import type { OAuth2Namespace } from '@fastify/oauth2'
import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace
    authenticate: any
  }

  interface FastifyRequest {
    user: any
  }
}
