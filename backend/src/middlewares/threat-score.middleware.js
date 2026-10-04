import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { enforceIpNotBlocked } from "../services/threat.service.js";

export const threatScoreCheckMiddleware = async (req, _res, next) => {
  if (env.NODE_ENV === "test") return next();

  try {
    await enforceIpNotBlocked(req.ip);

    if (req.user?.id) {
      const subjectKey = `${req.user.id}:${req.ip}`;
      const score = await prisma.threatScore.findUnique({
        where: { subjectKey },
      });
      if (score && score.score >= env.THREAT_THRESHOLD) {
        throw new AppError("Access denied.", 403, "THREAT_THRESHOLD_EXCEEDED");
      }
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
