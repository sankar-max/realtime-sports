import { WebSocketServer, WebSocket } from "ws";
import type { Server as HTTPServer } from "http";
import type { matches } from "../db/schema";
function sendJson(socket: WebSocket, payload: unknown) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}
function broadcast(wss: WebSocketServer, payload: unknown) {
  wss.clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) return;
    client.send(JSON.stringify(payload));
  });
}

export function attachWSS(httpServer: HTTPServer) {
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  wss.on("connection", (socket) => {
    sendJson(socket, {
      type: "connected",
      timestamp: Date.now(),
    });
    socket.on("error", (err) => {
      sendJson(socket, {
        type: "error",
        message: err.message,
      });
    });
  });
  function broadcastMatchCreated(match: typeof matches.$inferSelect) {
    broadcast(wss, {
      type: "match_created",
      data: match,
      timestamp: Date.now(),
    });
  }
  return { broadcastMatchCreated };
}
