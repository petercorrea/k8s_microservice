import { type FastifyInstance } from 'fastify';

// Routes
export const protected_routes = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get(
    '/protected',
    { preValidation: [fastify.authenticate] },
    async (req, res) => {
      return 'This is protected';
    }
  );
};
