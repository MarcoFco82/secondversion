/**
 * Auth Middleware for Admin endpoints
 * Uses simple JWT-like token validation
 */

// Simple token validation (will be replaced with proper JWT later)
export async function validateAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid authorization header' };
  }

  const token = authHeader.split(' ')[1];
  
  // For now, check against a secret in environment
  // In production, implement proper JWT validation
  if (token !== env.ADMIN_SECRET) {
    return { valid: false, error: 'Invalid token' };
  }

  return { valid: true };
}

/**
 * Generate unique ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Generate project code in format PRJ-[Greek][Num][Letter]
 */
export function generateProjectCode() {
  const greekLetters = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
  const greek = greekLetters[Math.floor(Math.random() * greekLetters.length)];
  const num = Math.floor(Math.random() * 10);
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `PRJ-${greek}${num}${letter}`;
}

/**
 * CORS headers for admin endpoints
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
