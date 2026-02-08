import { FastifyInstance } from 'fastify';
import { getCachedUrl, setCachedUrl } from '../services/cache.service.js';
import { getUrlByShortCode } from '../services/url.service.js';
import { logClick } from '../services/analytics.service.js';

export async function redirectRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: { shortCode: string } }>(
    '/:shortCode',
    async (request, reply) => {
      const { shortCode } = request.params;

      if (shortCode.startsWith('api') || shortCode === 'dashboard' || shortCode === 'favicon.ico') {
        return reply.callNotFound();
      }

      try {
        let originalUrl = getCachedUrl(shortCode);
        let urlId: number | null = null;

        if (!originalUrl) {
          const url = getUrlByShortCode(shortCode);
          if (!url || !url.isActive) {
            return reply.status(404).view('pages/404.ejs', {
              title: '404 - Not Found',
              baseUrl: process.env.BASE_URL || 'http://localhost:3000',
            });
          }
          originalUrl = url.originalUrl;
          urlId = url.id;
          setCachedUrl(shortCode, originalUrl);
        }

        // Log click before redirect
        if (!urlId) {
          const url = getUrlByShortCode(shortCode);
          if (url) urlId = url.id;
        }
        if (urlId) {
          logClick({
            urlId,
            ipAddress: request.ip,
            referrer: request.headers.referer,
            userAgent: request.headers['user-agent'],
          });
        }

        return reply.redirect(originalUrl);
      } catch (err) {
        request.log.error(err);
        return reply.status(500).send({
          error: { type: 'INTERNAL_ERROR', message: 'Redirect failed' },
        });
      }
    }
  );
}
