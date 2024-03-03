import 'dotenv/config';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { app } from '../../index.js';
import { configure_environment } from '../../utils/helpers.js';

// Load Configuration
const { env, env_path } = configure_environment();

beforeAll(async () => {
  await app.ready();
});

test('ensure environment is configured for test', async () => {
  expect(env).toBe('TEST');
});

test('ensure environment path is configured for test', async () => {
  expect(env_path.slice(-9)).toBe('.env.test');
});

afterAll(async () => {
  await app.close();
});
