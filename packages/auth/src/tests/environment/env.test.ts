import 'dotenv/config';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { app } from '../../index.js';
import { configure_environment } from '../../utils/helpers.js';

// Load Configuration
const { ENV, ENV_PATH } = configure_environment();

beforeAll(async () => {
  await app.ready();
});

test('ensure environment is configured for test', async () => {
  expect(ENV).toBe('TEST');
});

test('ensure environment path is configured for test', async () => {
  expect(ENV_PATH.slice(-9)).toBe('.env.test');
});

afterAll(async () => {
  await app.close();
});
