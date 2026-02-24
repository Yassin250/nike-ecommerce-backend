import { Router } from "express";
import * as ctrl from "../controllers/cart.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validateRequest, schemas } from "../middleware/validateRequest.js";

const router = Router();

router.use(authenticate);

router.get("/",               ctrl.getCart);
router.post("/",              validateRequest(schemas.addToCart), ctrl.addItem);
router.patch("/:itemId",      ctrl.updateItem);
router.delete("/:itemId",     ctrl.removeItem);
router.delete("/",            ctrl.clearCart);

export default router;