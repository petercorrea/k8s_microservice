import { Type, type Static } from '@sinclair/typebox';
import { type FastifyInstance } from 'fastify';

// Schema
export const HomeResponse = Type.Object({
  hello: Type.String(),
});

// Type
export type IHomeResponse = Static<typeof HomeResponse>;

// Routes
export const public_routes = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get<{ Reply: IHomeResponse }>(
    '/',
    {
      schema: {
        response: {
          200: HomeResponse,
        },
      },
    },
    async (req, res) => {
      return { hello: 'Hello world!' };
    }
  );
};
