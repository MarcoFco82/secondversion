/**
 * Simple test endpoint
 */

export default async function handler(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
  });
}
