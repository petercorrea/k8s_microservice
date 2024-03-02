// dont need server running
import supertest from 'supertest'
import { afterAll, expect, test } from 'vitest'
import { app } from '../index.js'

test('with HTTP injection', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/',
  })

  expect(response.statusCode).toBe(200)
  expect(response.payload).toBe("This is home")
})

test('with a running server', async () => {
  await app.listen({port: 9000})
  await app.ready()

  const response = await supertest(app.server)
    .get('/')
    .expect(200)

   expect(response.text).toBe("This is home")
})

test('with fetch', async () => {
  // change this to undici
  const response = await fetch(`http://localhost:9000/`)
  let result = await response.text()
  expect(result).toBe("This is home")
})

afterAll(async () => {
  await app.close()
})