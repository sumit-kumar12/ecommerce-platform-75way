import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { pageViewEventController } from "../controllers/events.controller.js";

const eventsRoutes = Router();

// POST /api/v1/events/page-view
eventsRoutes.post("/page-view", asyncHandler(pageViewEventController));

export default eventsRoutes;
