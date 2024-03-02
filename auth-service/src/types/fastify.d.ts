import type { OAuth2Namespace } from '@fastify/oauth2';
import 'fastify';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
    authenticate: any;
  }
}
