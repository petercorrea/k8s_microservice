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
  ENV: string | undefined;
  ENV_PATH: string;
} => {
  // Load Configuration
  const ENV = getENV();
  const ENV_PATH = path.resolve(process.cwd(), `.env.${ENV}`).toLowerCase();
  dotenv.config({ path: ENV_PATH });

  return {
    ENV,
    ENV_PATH,
  };
};
