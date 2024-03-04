import { type FastifyInstance } from 'fastify';
import {
  AUTH_TOKEN_COOKIE_CONFIG,
  REFRESH_TOKEN_COOKIE_CONFIG,
  create_auth_token_config,
  create_refresh_token_config,
} from '../constants/auth.js';
import { getUser } from '../utils/helpers.js';

// Routes
export const auth_routes = async (fastify: FastifyInstance): Promise<void> => {
  // Oauth
  fastify.get('/login/google/callback', async (request, reply) => {
    const { token } =
      await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        request
      );

    const user: {
      id: string;
      email: string;
      given_name: string;
      family_name: string;
      picture: string;
    } = await getUser(token.access_token);
    const { id, email, given_name, family_name, picture } = user;

    // create tokens
    const { config: auth_token_config, expiry: auth_token_expiry } =
      create_auth_token_config(id, email, given_name, family_name, picture);
    const ACCESS_TOKEN = await reply.jwtSign(
      auth_token_config,
      auth_token_expiry
    );

    const { config: refresh_token_config, expiry: refresh_token_expiry } =
      create_refresh_token_config(id, email, given_name, family_name, picture);
    const REFRESH_TOKEN = await reply.jwtSign(
      refresh_token_config,
      refresh_token_expiry
    );

    // set cookies
    return await reply
      .setCookie('__Host-auth_token', ACCESS_TOKEN, AUTH_TOKEN_COOKIE_CONFIG)
      .setCookie(
        '__Host-refresh_token',
        REFRESH_TOKEN,
        REFRESH_TOKEN_COOKIE_CONFIG
      )
      .send({ message: 'Authentication successful' });
  });

  // Auth helper endpoints
  fastify.get(
    '/validate',
    { preValidation: [fastify.authenticate] },
    async (req, res) => {
      return await res.send({ message: 'Valid token' });
    }
  );
};
