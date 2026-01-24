export function getDB() {
  // @ts-ignore - Cloudflare binding será inyectado en runtime
  return globalThis.DB as D1Database | undefined;
}