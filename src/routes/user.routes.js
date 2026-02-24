import { Router } from "express";
import * as ctrl from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/me",              ctrl.getProfile);
router.patch("/me",            ctrl.updateProfile);
router.patch("/me/password",   ctrl.changePassword);

export default router;