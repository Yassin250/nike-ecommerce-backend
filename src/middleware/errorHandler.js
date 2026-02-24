import { errorResponse } from "../utils/apiResponse.js";

export const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err);

    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
        return res.status(422).json({ success: false, message: "Validation failed", errors });
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ success: false, message: `${field} already exists` });
    }
    if (err.name === "CastError") {
        return res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
    }
    if (err.name === "JsonWebTokenError") return res.status(401).json({ success: false, message: "Invalid token" });
    if (err.name === "TokenExpiredError") return res.status(401).json({ success: false, message: "Token expired" });
    if (err.isOperational) return res.status(err.statusCode || 400).json({ success: false, message: err.message });

    return errorResponse(res, {
        message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
        statusCode: err.statusCode || 500,
    });
};

export class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}