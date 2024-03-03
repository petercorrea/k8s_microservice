import { type CookieSerializeOptions } from '@fastify/cookie';
import { getENV } from '../utils/helpers.js';

export const http_test_agent = {
  rejectUnauthorized: false,
};

export const create_auth_token_config = (
  ...values: string[]
): { config: object; expiry: object } => {
  const env = getENV();

  return {
    config: {
      ...values,
    },
    expiry: { expiresIn: env === 'PROD' ? '1h' : '1m' },
  };
};

export const create_refresh_token_config = (
  ...values: string[]
): { config: object; expiry: object } => {
  return {
    config: {
      ...values,
    },
    expiry: { expiresIn: '7d' },
  };
};

export const AUTH_TOKEN_COOKIE_CONFIG: CookieSerializeOptions = {
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 3600,
};

export const REFRESH_TOKEN_COOKIE_CONFIG: CookieSerializeOptions = {
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 604_800,
};
