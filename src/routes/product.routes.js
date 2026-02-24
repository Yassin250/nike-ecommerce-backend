import { Router } from "express";
import * as ctrl from "../controllers/product.controller.js";

const router = Router();

router.get("/",    ctrl.getProducts);
router.get("/:id", ctrl.getProduct);

export default router;