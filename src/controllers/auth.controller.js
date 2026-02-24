import * as authService from "../services/auth.service.js";
import { successResponse, createdResponse, errorResponse } from "../utils/apiResponse.js";

export const register = async (req, res, next) => {
    try {
        const { user, tokens } = await authService.register(req.body);
        return createdResponse(res, { message: "Account created successfully", data: { user, ...tokens } });
    } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
    try {
        const { user, tokens } = await authService.login(req.body);
        return successResponse(res, { message: "Login successful", data: { user, ...tokens } });
    } catch (err) { next(err); }
};

export const logout = async (req, res, next) => {
    try {
        await authService.logout(req.user._id);
        return successResponse(res, { message: "Logged out successfully" });
    } catch (err) { next(err); }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user._id);
        return successResponse(res, { data: user });
    } catch (err) { next(err); }
};

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return errorResponse(res, { message: "Refresh token required", statusCode: 400 });
        const { user, tokens } = await authService.refreshTokens(refreshToken);
        return successResponse(res, { message: "Tokens refreshed", data: { user, ...tokens } });
    } catch (err) { next(err); }
};