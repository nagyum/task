export const runtime = "nodejs";

const UPSTREAM_BASE_URL =
  process.env.API_PROXY_TARGET ?? "https://front-mission.bigs.or.kr";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function buildUpstreamUrl(pathSegments: string[] | undefined, reqUrl: string) {
  const path = pathSegments?.join("/") ?? "";
  const search = new URL(reqUrl).search;
  return `${UPSTREAM_BASE_URL.replace(/\/+$/, "")}/${path}${search}`;
}

async function proxyRequest(req: Request, context: RouteContext) {
  const { path } = await context.params;
  const url = buildUpstreamUrl(path, req.url);

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length");

  const hasBody = !["GET", "HEAD"].includes(req.method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstreamResponse = await fetch(url, {
    method: req.method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
    redirect: "manual",
  });

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set("Cache-Control", "no-store");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(req: Request, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function POST(req: Request, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function PUT(req: Request, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function PATCH(req: Request, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function DELETE(req: Request, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function OPTIONS(req: Request, context: RouteContext) {
  return proxyRequest(req, context);
}
