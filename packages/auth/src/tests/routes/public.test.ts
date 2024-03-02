import supertest from 'supertest';
import type TestAgent from 'supertest/lib/agent.js';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { http_test_agent } from '../../constants/constants.js';
import { app } from '../../index.js';

let request: TestAgent;

beforeAll(async () => {
  await app.ready();
  request = supertest.agent(app.server, http_test_agent);
});

test('public routes', async () => {
  const response = await request.get('/').expect(200);
  expect(response.body.hello).toBe('Hello world!');
});

afterAll(async () => {
  await app.close();
});
