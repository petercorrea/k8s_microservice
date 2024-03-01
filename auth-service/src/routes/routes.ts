import { type FastifyInstance } from 'fastify'
import { Person, Response, type PersonType, type ResponseType } from '../types/person.js'

// Routes
const routes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async (req, res) => {
    return 'This is home'
  })

  fastify.get('/public', async (req, res) => {
    return 'This is public'
  })

  fastify.get('/protected', { preValidation: [fastify.authenticate] }, async (req, res) => {
    return 'This is protected'
  })

  fastify.post<{
    Body: PersonType
    Reply: ResponseType
  }>('/post', {
    schema: {
      body: Person,
      response: {
        200: Response
      }
    }
  }, async (req, res) => {
    return { ...req.body }
  })

  // Oauth
  fastify.get('/login/google/callback', async (request, reply) => {
    // change this to user id
    const { token } = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
    const jwt = fastify.jwt.sign({ jwt: token.access_token })
    return { jwt: jwt }
  })
}

export default routes
