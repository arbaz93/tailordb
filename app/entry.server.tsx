import { createRequestHandler } from "@react-router/node";

export default createRequestHandler({
  build: () => import("virtual:react-router/server-build"),
});
