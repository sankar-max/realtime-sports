import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { matchRouter } from "./modules/matches/matches.routes";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { notFoundHandler } from "./middleware/notFoundHandler";
import http from "http";
import { attachWSS } from "./ws/server";

const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

app.use(express.json());
app.use(requestLogger);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: [`http://localhost:5555`],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
  }),
);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});
app.use("/matches", matchRouter);
const { broadcastMatchCreated } = attachWSS(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

app.use(notFoundHandler);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
