/**
 * API Route: Public CV data
 * GET /api/cv - Returns full CV (meta + sections grouped by type)
 * Query: ?lang=en (default: en)
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch (e) {
      console.log('D1 not available');
    }

    if (!db) {
      return res.status(200).json({ success: true, data: { meta: null, sections: {} } });
    }

    const lang = req.query.lang || 'en';

    const metaResult = await db.prepare(
      'SELECT * FROM cv_meta WHERE lang = ? LIMIT 1'
    ).bind(lang).all();

    const sectionsResult = await db.prepare(
      'SELECT * FROM cv_sections WHERE lang = ? ORDER BY section_type, sort_order ASC'
    ).bind(lang).all();

    const meta = metaResult.results?.[0] || null;
    const sections = {};

    for (const row of sectionsResult.results || []) {
      if (row.bullets) {
        try { row.bullets = JSON.parse(row.bullets); } catch {}
      }
      if (row.items) {
        try { row.items = JSON.parse(row.items); } catch {}
      }
      if (!sections[row.section_type]) {
        sections[row.section_type] = [];
      }
      sections[row.section_type].push(row);
    }

    return res.status(200).json({
      success: true,
      data: { meta, sections },
    });
  } catch (error) {
    console.error('Get CV error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
