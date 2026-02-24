import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

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

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security & Logging
app.use(helmet());
app.use(morgan("dev"));

// ✅ CORS Configuration - Allow both local and production
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL, // Railway will have Vercel URL here
].filter(Boolean); // Remove any undefined values

app.use(cors({ 
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true 
}));

// ⚠️  Stripe webhook BEFORE express.json() — needs raw body
app.use("/api/payments", stripeRoutes);

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(apiLimiter);

// Routes
app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/users",    userRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ 
        success: true, 
        message: "Server is running", 
        timestamp: new Date(),
        env: process.env.NODE_ENV 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: `Route ${req.originalUrl} not found` 
    });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🌍 Allowed origins:`, allowedOrigins);
});

export default app;