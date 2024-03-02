import supertest from 'supertest';
import type TestAgent from 'supertest/lib/agent.js';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { app } from '../../index.js';
import { http_test_agent } from '../constants.js';

let request: TestAgent;

beforeAll(async () => {
  await app.ready();
  request = supertest.agent(app.server, http_test_agent);
});

test('healthchecks', async () => {
  const response = await request.get('/healthcheck').expect(200);
  expect(response.body.status).toBe('OK');
});

afterAll(async () => {
  await app.close();
});
