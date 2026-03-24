/**
 * API: Admin CV Section by ID
 * PUT /api/admin/cv/sections/[id] - Update a section entry
 * DELETE /api/admin/cv/sections/[id] - Delete a section entry
 */

import { getCloudflareContext } from '@opennextjs/cloudflare';

const validateAuth = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing authorization header' };
  }
  return { valid: true };
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = validateAuth(req);
  if (!auth.valid) {
    return res.status(401).json({ success: false, error: auth.error });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, error: 'Missing section ID' });
  }

  try {
    let db = null;
    try {
      const { env } = await getCloudflareContext();
      db = env.DB;
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Database not available' });
    }

    if (req.method === 'PUT') {
      const {
        section_type, title, subtitle, location,
        date_start, date_end, description, bullets,
        skill_category, items, sort_order, lang
      } = req.body;

      const fields = [];
      const values = [];

      const fieldMap = {
        section_type, title, subtitle, location,
        date_start, date_end, description, skill_category, lang
      };

      for (const [key, val] of Object.entries(fieldMap)) {
        if (val !== undefined) {
          fields.push(`${key} = ?`);
          values.push(val);
        }
      }

      if (bullets !== undefined) {
        fields.push('bullets = ?');
        values.push(bullets ? JSON.stringify(bullets) : null);
      }
      if (items !== undefined) {
        fields.push('items = ?');
        values.push(items ? JSON.stringify(items) : null);
      }
      if (sort_order !== undefined) {
        fields.push('sort_order = ?');
        values.push(sort_order);
      }

      if (fields.length === 0) {
        return res.status(400).json({ success: false, error: 'No fields to update' });
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      await db.prepare(
        `UPDATE cv_sections SET ${fields.join(', ')} WHERE id = ?`
      ).bind(...values).run();

      return res.status(200).json({ success: true, data: { id } });
    }

    if (req.method === 'DELETE') {
      await db.prepare('DELETE FROM cv_sections WHERE id = ?').bind(id).run();
      return res.status(200).json({ success: true, data: { id } });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin CV section error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
