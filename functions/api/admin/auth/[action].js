/**
 * Admin API: Authentication
 * POST /api/admin/auth/login - Login and get token
 * POST /api/admin/auth/verify - Verify token validity
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}

// Simple hash function for password comparison
// In production, use bcrypt or similar
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate a simple token (in production use proper JWT)
function generateToken(userId, secret) {
  const payload = {
    userId,
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    iat: Date.now(),
  };
  // Simple base64 encoding (in production use proper JWT signing)
  const encoded = btoa(JSON.stringify(payload));
  return `${encoded}.${secret.substring(0, 8)}`;
}

// Verify token
function verifyToken(token, secret) {
  try {
    const [encoded, sig] = token.split('.');
    if (sig !== secret.substring(0, 8)) {
      return { valid: false, error: 'Invalid signature' };
    }
    const payload = JSON.parse(atob(encoded));
    if (payload.exp < Date.now()) {
      return { valid: false, error: 'Token expired' };
    }
    return { valid: true, userId: payload.userId };
  } catch (e) {
    return { valid: false, error: 'Invalid token format' };
  }
}

// POST - Handle login or verify based on path
export async function onRequestPost(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const action = url.pathname.split('/').pop(); // 'login' or 'verify'

  // ===========================================
  // LOGIN
  // ===========================================
  if (action === 'login') {
    try {
      const body = await request.json();
      const { username, password } = body;

      if (!username || !password) {
        return Response.json({
          success: false,
          error: 'Username and password required',
        }, { status: 400, headers: corsHeaders });
      }

      // Check against database
      const user = await env.DB.prepare(
        'SELECT id, username, password_hash FROM admin_users WHERE username = ?'
      ).bind(username).first();

      if (!user) {
        return Response.json({
          success: false,
          error: 'Invalid credentials',
        }, { status: 401, headers: corsHeaders });
      }

      // Verify password
      const passwordHash = await hashPassword(password);
      if (passwordHash !== user.password_hash) {
        return Response.json({
          success: false,
          error: 'Invalid credentials',
        }, { status: 401, headers: corsHeaders });
      }

      // Update last login
      await env.DB.prepare(
        'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(user.id).run();

      // Generate token
      const token = generateToken(user.id, env.ADMIN_SECRET || 'default-secret');

      return Response.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
          },
        },
      }, { headers: corsHeaders });

    } catch (error) {
      return Response.json({
        success: false,
        error: error.message,
      }, { status: 500, headers: corsHeaders });
    }
  }

  // ===========================================
  // VERIFY TOKEN
  // ===========================================
  if (action === 'verify') {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({
        success: false,
        error: 'No token provided',
      }, { status: 401, headers: corsHeaders });
    }

    const token = authHeader.split(' ')[1];
    const result = verifyToken(token, env.ADMIN_SECRET || 'default-secret');

    if (!result.valid) {
      return Response.json({
        success: false,
        error: result.error,
      }, { status: 401, headers: corsHeaders });
    }

    return Response.json({
      success: true,
      data: { userId: result.userId },
    }, { headers: corsHeaders });
  }

  return Response.json({
    success: false,
    error: 'Unknown action',
  }, { status: 400, headers: corsHeaders });
}
