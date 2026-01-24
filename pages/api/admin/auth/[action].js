/**
 * Next.js API Route for Admin Auth (Development)
 * Mirrors the Cloudflare Function for local dev
 */

// Simple hash function
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Mock admin user for development
  const MOCK_ADMIN = {
    id: 'admin-001',
    username: 'marcofco',
    passwordHash: '81e774ca967b89081a4c3282896f0b7fa14dcc75e0a7876390865cf41a3de1df', // 'Westeros2018'
  };
  
  const ADMIN_SECRET = 'devlog-secret-2025';
  
  function generateToken(userId) {
    const payload = {
      userId,
      exp: Date.now() + (24 * 60 * 60 * 1000),
      iat: Date.now(),
    };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');
    return `${encoded}.${ADMIN_SECRET.substring(0, 8)}`;
  }
  
  function verifyToken(token) {
    try {
      const [encoded, sig] = token.split('.');
      if (sig !== ADMIN_SECRET.substring(0, 8)) {
        return { valid: false, error: 'Invalid signature' };
      }
      const payload = JSON.parse(Buffer.from(encoded, 'base64').toString());
      if (payload.exp < Date.now()) {
        return { valid: false, error: 'Token expired' };
      }
      return { valid: true, userId: payload.userId };
    } catch (e) {
      return { valid: false, error: 'Invalid token format' };
    }
  }
  
  export default async function handler(req, res) {
    const { action } = req.query;
  
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  
    // LOGIN
    if (action === 'login') {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password required' });
      }
  
      if (username !== MOCK_ADMIN.username) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
  
      const passwordHash = await hashPassword(password);
      if (passwordHash !== MOCK_ADMIN.passwordHash) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
  
      const token = generateToken(MOCK_ADMIN.id);
  
      return res.status(200).json({
        success: true,
        data: {
          token,
          user: { id: MOCK_ADMIN.id, username: MOCK_ADMIN.username },
        },
      });
    }
  
    // VERIFY
    if (action === 'verify') {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'No token provided' });
      }
  
      const token = authHeader.split(' ')[1];
      const result = verifyToken(token);
  
      if (!result.valid) {
        return res.status(401).json({ success: false, error: result.error });
      }
  
      return res.status(200).json({ success: true, data: { userId: result.userId } });
    }
  
    return res.status(400).json({ success: false, error: 'Unknown action' });
  }