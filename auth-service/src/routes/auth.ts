import { type FastifyInstance } from 'fastify';

// Routes
export const auth_routes = async (fastify: FastifyInstance): Promise<void> => {
  // Oauth
  fastify.get('/login/google/callback', async (request, reply) => {
    // TODO: change this to user id
    const { token } =
      await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        request
      );
    const JWT = reply.jwtSign({ jwt: token.access_token }, { expiresIn: '1h' });
    return { jwt: JWT };
  });
};
