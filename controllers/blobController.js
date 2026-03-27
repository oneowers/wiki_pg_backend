const { get } = require('@vercel/blob');
const ApiError = require('../error/ApiError');
const { Readable } = require('node:stream');

class BlobController {
  async serve(req, res, next) {
    try {
      const pathname = req.query.pathname;
      if (!pathname || typeof pathname !== 'string') {
        return next(ApiError.badRequest('Missing "pathname"'));
      }

      // Try private first, then fall back to public.
      // This keeps the app working regardless of how the store is configured.
      let result = await get(pathname, { access: 'private' }).catch(() => null);
      if (!result) {
        result = await get(pathname, { access: 'public' });
      }
      if (!result || result.statusCode !== 200) {
        return res.status(404).send('Not found');
      }

      res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
      res.setHeader('X-Content-Type-Options', 'nosniff');

      // stream returned by @vercel/blob is a Web stream
      Readable.fromWeb(result.stream).pipe(res);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new BlobController();

