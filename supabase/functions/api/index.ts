import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  const url = new URL(req.url);

  if (url.pathname === '/health') {
    return new Response(JSON.stringify({ status: 'healthy' }), {
      status: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  if (url.pathname === '/pdf-to-pptx' && req.method === 'POST') {
    return new Response(JSON.stringify({ error: 'PDF→PPTX not yet available on Edge Functions' }), {
      status: 501,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
});

