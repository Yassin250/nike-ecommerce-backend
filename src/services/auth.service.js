import * as userRepo from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt.js";
import { AppError } from "../middleware/errorHandler.js";

export const register = async ({ name, email, password }) => {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new AppError("Email already registered", 409);

    const hashed = await hashPassword(password);
    const user   = await userRepo.create({ name, email, password: hashed });
    const tokens = generateTokenPair({ id: user._id, role: user.role });

    await userRepo.updateById(user._id, { refreshToken: tokens.refreshToken, lastLoginAt: new Date() });
    return { user, tokens };
};

export const login = async ({ email, password }) => {
    const user = await userRepo.findByEmail(email);
    if (!user)          throw new AppError("Invalid email or password", 401);
    if (!user.isActive) throw new AppError("Account has been deactivated", 403);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new AppError("Invalid email or password", 401);

    const tokens = generateTokenPair({ id: user._id, role: user.role });
    await userRepo.updateById(user._id, { refreshToken: tokens.refreshToken, lastLoginAt: new Date() });
    return { user, tokens };
};

export const logout = (userId) => userRepo.updateById(userId, { refreshToken: null });

export const refreshTokens = async (token) => {
    let decoded;
    try { decoded = verifyRefreshToken(token); }
    catch { throw new AppError("Invalid or expired refresh token", 401); }

    const user = await userRepo.findByIdWithToken(decoded.id);
    if (!user || user.refreshToken !== token) throw new AppError("Invalid refresh token", 401);

    const tokens = generateTokenPair({ id: user._id, role: user.role });
    await userRepo.updateById(user._id, { refreshToken: tokens.refreshToken });
    return { user, tokens };
};

export const getMe = async (userId) => {
    const user = await userRepo.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user;
};