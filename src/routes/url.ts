import { FastifyInstance } from 'fastify';
import { createShortUrl, validateUrl, getRecentUrls } from '../services/url.service.js';

interface CreateUrlBody {
  url: string;
}

export async function urlRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateUrlBody }>(
    '/api/urls',
    {
      schema: {
        body: {
          type: 'object',
          required: ['url'],
          properties: {
            url: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { url } = request.body;

      const validation = validateUrl(url);
      if (!validation.valid) {
        return reply.status(422).send({
          error: { type: 'VALIDATION_ERROR', message: validation.error },
        });
      }

      try {
        const result = createShortUrl(url);
        return reply.status(201).send(result);
      } catch (err) {
        request.log.error(err);
        return reply.status(500).send({
          error: { type: 'INTERNAL_ERROR', message: 'Failed to create short URL' },
        });
      }
    }
  );

  fastify.get('/api/urls', async (_request, reply) => {
    try {
      const result = getRecentUrls(10);
      return reply.send(result);
    } catch (err) {
      _request.log.error(err);
      return reply.status(500).send({
        error: { type: 'INTERNAL_ERROR', message: 'Failed to fetch URLs' },
      });
    }
  });
}
