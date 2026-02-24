import { Router } from "express";
import express from "express";
import * as ctrl from "../controllers/stripe.controller.js";
import { authenticate } from "../middleware/auth.js";
import { paymentLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// ⚠️  Raw body needed for webhook signature verification
router.post("/webhook", express.raw({ type: "application/json" }), ctrl.handleWebhook);
router.post("/create-intent", authenticate, paymentLimiter, ctrl.createPaymentIntent);

export default router;