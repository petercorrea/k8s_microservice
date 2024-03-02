import { Type, type Static } from '@sinclair/typebox';
import { type FastifyInstance } from 'fastify';

// Schema
export const HealthCheckResponse = Type.Object({
  status: Type.String(),
});

// Type
export type IHealthCheckResponse = Static<typeof HealthCheckResponse>;

// Routes
export const healthchecks_routes = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get<{ Reply: IHealthCheckResponse }>(
    '/healthcheck',
    {
      schema: {
        response: {
          200: HealthCheckResponse,
        },
      },
    },
    async (req, res) => {
      return { status: 'OK' };
    }
  );
};
