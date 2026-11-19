import express, { type Express } from "express";
import path from "node:path";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/authMiddleware";

const app: Express = express();
// Replit terminates HTTPS at its reverse proxy; trust that single ingress hop.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use("/api", router);

// Serve the built React app and API from the same Render web service.
// Render starts this service with cwd=artifacts/api-server, so go back to
// the repository root before resolving the separately built frontend.
const frontendDist = path.resolve(
  process.cwd(),
  "../../artifacts/roblox-shop/dist/public",
);
app.use(express.static(frontendDist, { index: false }));

app.get(/.*/, (req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) {
    next();
    return;
  }

  res.sendFile(path.join(frontendDist, "index.html"), (error) => {
    if (error) next(error);
  });
});

export default app;
