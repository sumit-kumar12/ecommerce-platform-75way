import { WebSocketServer } from "ws";
import { parse as parseUrl } from "node:url";
import { env } from "./config/env.js";
import { verifyAccessToken } from "./services/token.service.js";
import { loggers } from "./config/logger.js";
import { isSecurityAdminRole } from "./config/constants.js";

const clients = new Set();

function getTokenFromRequest(request) {
  const { query } = parseUrl(request.url ?? "", true);
  if (query?.token && typeof query.token === "string") return query.token;
  const cookieHeader = request.headers?.cookie ?? "";
  const match = cookieHeader.match(new RegExp(`${env.ACCESS_COOKIE_NAME}=([^;]+)`));
  return match?.[1]?.trim() ?? null;
}

export function attachThreatWs(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (request, socket, head) => {
    const { pathname } = parseUrl(request.url ?? "", true);
    if (pathname !== "/ws/threat") {
      socket.destroy();
      return;
    }

    const token = getTokenFromRequest(request);
    if (!token) {
      socket.destroy();
      return;
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      socket.destroy();
      return;
    }

    if (!isSecurityAdminRole(payload.role)) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("close", () => {
      clients.delete(ws);
    });
    ws.on("error", () => {
      clients.delete(ws);
    });
  });

  loggers.app.info({
    eventType: "threat_websocket_server_attached",
    details: { path: "/ws/threat" },
  });
}

export function broadcastThreatEvent(payload) {
  const message = JSON.stringify({
    channel: "threat-events",
    ...payload,
  });
  for (const client of clients) {
    if (client.readyState === 1) {
      try {
        client.send(message);
      } catch {
        clients.delete(client);
      }
    }
  }
}
