import { env } from "../config/env.js";
import { getMetricsContentType, renderMetrics } from "../config/metrics.js";

const parseBearer = (value) => {
  if (!value || typeof value !== "string") return null;
  const [scheme, token] = value.split(" ");
  if (scheme?.toLowerCase() !== "bearer") return null;
  return token ?? null;
};

export const metricsController = async (req, res) => {
  const token = parseBearer(req.get("authorization"));
  if (!token || token !== env.METRICS_TOKEN) {
    return res.status(401).json({ error: "Unauthorized", code: "METRICS_UNAUTHORIZED" });
  }

  res.set("Content-Type", getMetricsContentType());
  res.status(200).send(await renderMetrics());
};
