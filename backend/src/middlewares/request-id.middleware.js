import { v4 as uuidv4 } from "uuid";

export const requestIdMiddleware = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader("x-request-id", req.id);
  next();
};
