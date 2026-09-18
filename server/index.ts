import express from "express";
import cors from "cors";
import { env } from "./src/config/env.js";
import { errorHandler, notFound } from "./src/middleware/error.middleware.js";
import { authRoutes, farmerRoutes, centreRoutes, slotRoutes, tokenRoutes, officerRoutes, operatorRoutes, procurementRoutes, paymentRoutes, notificationRoutes, adminRoutes, chatRoutes } from "./src/routes/index.js";

export function createServer() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin === "*" ? true : env.corsOrigin }));
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", async (_req, res) => {
    try {
      const { pool } = await import("./src/config/database.js");
      await pool.query("select 1");
      res.json({ success: true, message: "K-SMART Backend is running", data: { database: "connected", environment: env.nodeEnv } });
    } catch {
      res.status(503).json({ success: false, error: { code: "DB_UNAVAILABLE", message: "Database unavailable" } });
    }
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/farmers", farmerRoutes);
  app.use("/api/centres", centreRoutes);
  app.use("/api/slots", slotRoutes);
  app.use("/api/tokens", tokenRoutes);
  app.use("/api/officer", officerRoutes);
  app.use("/api/operator", operatorRoutes);
  app.use("/api/procurement", procurementRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/chat", chatRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

const app = createServer();

if (process.env.NODE_ENV !== "test") {
  app.listen(env.port, () => {
    console.log(`K-SMART Backend running on port ${env.port}`);
  });
}

export default app;
