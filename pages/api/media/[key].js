/**
 * API: Serve Media from R2
 * GET /api/media/[key] - Serve media file from R2 bucket
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'Key required' });
  }

  try {
    const { env } = await getCloudflareContext();
    const r2 = env.MEDIA_BUCKET;

    if (!r2) {
      return res.status(500).json({ error: 'R2 not configured' });
    }

    const object = await r2.get(key);

    if (!object) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get content type from R2 object metadata
    const contentType = object.httpMetadata?.contentType || 'application/octet-stream';
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Type', contentType);
    
    // Get the body as ArrayBuffer and convert to Buffer
    const arrayBuffer = await object.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('Serve media error:', error);
    return res.status(500).json({ error: error.message });
  }
}