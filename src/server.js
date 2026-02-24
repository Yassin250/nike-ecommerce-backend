import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import authRoutes    from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes    from "./routes/cart.routes.js";
import orderRoutes   from "./routes/order.routes.js";
import stripeRoutes  from "./routes/stripe.routes.js";
import adminRoutes   from "./routes/admin.routes.js";
import userRoutes    from "./routes/user.routes.js";
import uploadRoutes  from "./routes/upload.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));

// ⚠️  Stripe webhook BEFORE express.json() — needs raw body
app.use("/api/payments", stripeRoutes);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/upload",   uploadRoutes);

app.get("/health", (req, res) => {
    res.json({ success: true, message: "Server is running", timestamp: new Date() });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;