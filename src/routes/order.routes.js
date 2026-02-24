import { Router } from "express";
import * as ctrl from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.post("/",   ctrl.createOrder);
router.get("/",    ctrl.getOrders);
router.get("/:id", ctrl.getOrder);

export default router;