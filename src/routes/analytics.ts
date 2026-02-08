import { FastifyInstance } from 'fastify';
import { getStats } from '../services/analytics.service.js';
import { env } from '../config/env.js';

export async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: { shortCode: string } }>(
    '/api/urls/:shortCode/stats',
    async (request, reply) => {
      const { shortCode } = request.params;
      try {
        const stats = getStats(shortCode);
        if (!stats) {
          return reply.status(404).send({
            error: { type: 'NOT_FOUND', message: 'URL not found' },
          });
        }
        return reply.send(stats);
      } catch (err) {
        request.log.error(err);
        return reply.status(500).send({
          error: { type: 'INTERNAL_ERROR', message: 'Failed to fetch analytics' },
        });
      }
    }
  );

  fastify.get<{ Params: { shortCode: string } }>(
    '/dashboard/:shortCode',
    async (request, reply) => {
      const { shortCode } = request.params;
      try {
        const stats = getStats(shortCode);
        if (!stats) {
          return reply.status(404).view('pages/404.ejs', {
            title: '404 - Not Found',
            baseUrl: env.baseUrl,
          });
        }
        return reply.view('pages/dashboard.ejs', {
          title: `Analytics - ${shortCode}`,
          baseUrl: env.baseUrl,
          stats,
          shortCode,
        });
      } catch (err) {
        request.log.error(err);
        return reply.status(500).send('Internal Server Error');
      }
    }
  );
}
