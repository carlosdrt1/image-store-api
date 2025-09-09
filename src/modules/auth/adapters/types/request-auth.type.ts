import { FastifyRequest } from 'fastify';

export type RequestAuth = FastifyRequest & {
  user: {
    id: string;
  };
};
