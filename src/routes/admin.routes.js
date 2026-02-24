import { Router } from "express";
import * as ctrl from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/role.js";

const router = Router();

router.use(authenticate, requireAdmin);

// Products
router.get("/products",        ctrl.getProducts);
router.post("/products",       ctrl.createProduct);
router.put("/products/:id",    ctrl.updateProduct);
router.delete("/products/:id", ctrl.deleteProduct);

// Orders
router.get("/orders",          ctrl.getOrders);
router.get("/orders/:id",      ctrl.getOrder);
router.patch("/orders/:id",    ctrl.updateOrder);

// Users
router.get("/users",           ctrl.getUsers);
router.get("/users/:id",       ctrl.getUser);
router.patch("/users/:id",     ctrl.updateUser);

// Analytics
router.get("/analytics",                 ctrl.getAnalytics);
router.get("/analytics/revenue",         ctrl.getRevenueAnalytics);
router.get("/analytics/products",        ctrl.getProductAnalytics);
router.get("/analytics/users",           ctrl.getUserAnalytics);

export default router;