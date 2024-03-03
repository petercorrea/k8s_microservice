import dotenv from 'dotenv';
import 'dotenv/config';
import path from 'path';

export const getENV = (): string | undefined => {
  if (process.env.PROD === 'true') {
    return 'PROD';
  }
  if (process.env.TEST === 'true') {
    return 'TEST';
  }
  if (process.env.DEV === 'true') {
    return 'DEV';
  }
  return undefined;
};

export const configure_environment = (): {
  env: string | undefined;
  env_path: string;
} => {
  // Load Configuration
  const env = getENV();
  const env_path = path.resolve(process.cwd(), `.env.${env}`).toLowerCase();
  dotenv.config({ path: env_path });

  return {
    env,
    env_path,
  };
};

export const getUser = async (access_token: string): Promise<any> => {
  const response = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  return await response.json();
};
