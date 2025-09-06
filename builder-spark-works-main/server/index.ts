import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { authRouter } from "./routes/auth";
import { productsRouter } from "./routes/products";
import { commerceRouter } from "./routes/commerce";
import { aiRouter } from "./routes/ai";
import { usersRouter } from "./routes/users";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health + demo
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // App routes
  app.use("/api/auth", authRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api", commerceRouter); // /cart, /checkout, /purchases, /leaderboard
  app.use("/api/ai", aiRouter);

  return app;
}
