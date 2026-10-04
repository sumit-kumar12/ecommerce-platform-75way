import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import { 
  getAddressesController, 
  createAddressController, 
  updateAddressController, 
  deleteAddressController 
} from "../controllers/address.controller.js";

const router = Router();

// All address routes require authentication
router.use(requireAuthenticatedUserMiddleware);

router.get("/", asyncHandler(getAddressesController));
router.post("/", asyncHandler(createAddressController));
router.patch("/:id", asyncHandler(updateAddressController));
router.delete("/:id", asyncHandler(deleteAddressController));

export default router;
