import { createRequestHandler } from "@react-router/node";
import type { Handler } from "@netlify/functions";

const rrHandler = createRequestHandler({
  build: () => import("virtual:react-router/server-build"),
});

export const handler: Handler = async (event) => {
  const request = new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: event.headers as HeadersInit,
    body: event.body
      ? Buffer.from(event.body, "base64")
      : undefined,
  });

  const response = await rrHandler(request);

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers),
    body: await response.text(),
  };
};
