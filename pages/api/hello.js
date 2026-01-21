// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export const runtime = 'edge';

export default function handler(req) {
  return new Response(JSON.stringify({ name: "John Doe" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}