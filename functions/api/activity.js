/**
 * GET /api/activity
 * Get activity metrics for ActivityPulse (public)
 * 
 * Query params:
 * - days: number of days to fetch (default 14)
 */

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  const days = parseInt(url.searchParams.get('days') || '14');

  try {
    const { results } = await env.DB.prepare(`
      SELECT date, entry_count
      FROM activity_metrics
      ORDER BY date DESC
      LIMIT ?
    `).bind(days).all();

    // Reverse to get chronological order
    const metrics = results.reverse();

    // Fill in missing days with 0
    const today = new Date();
    const filledMetrics = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const existing = metrics.find(m => m.date === dateStr);
      filledMetrics.push({
        date: dateStr,
        entryCount: existing ? existing.entry_count : 0,
      });
    }

    return Response.json({
      success: true,
      data: filledMetrics,
      // Also return as simple array for ActivityPulse component
      values: filledMetrics.map(m => m.entryCount),
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
