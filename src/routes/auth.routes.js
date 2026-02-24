import { Router } from "express";
import * as ctrl from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validateRequest, schemas } from "../middleware/validateRequest.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, validateRequest(schemas.register), ctrl.register);
router.post("/login",    authLimiter, validateRequest(schemas.login),    ctrl.login);
router.post("/logout",   authenticate,                                    ctrl.logout);
router.get("/me",        authenticate,                                    ctrl.getMe);
router.post("/refresh",                                                   ctrl.refresh);

export default router;