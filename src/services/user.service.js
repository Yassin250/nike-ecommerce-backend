import * as userRepo from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { AppError } from "../middleware/errorHandler.js";

export const getUserById = async (id) => {
    const user = await userRepo.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return user;
};

export const updateProfile = async (userId, updates) => {
    // Strip sensitive fields — they have dedicated endpoints
    const { password, role, refreshToken, ...safeUpdates } = updates;
    const user = await userRepo.updateById(userId, safeUpdates);
    if (!user) throw new AppError("User not found", 404);
    return user;
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
    const userWithPass = await userRepo.findByEmail(
        (await userRepo.findById(userId)).email
    );
    const isMatch = await comparePassword(currentPassword, userWithPass.password);
    if (!isMatch) throw new AppError("Current password is incorrect", 401);
    if (newPassword.length < 6) throw new AppError("New password must be at least 6 characters", 400);

    const hashed = await hashPassword(newPassword);
    await userRepo.updateById(userId, { password: hashed });
};

export const getAllUsers = async ({ page = 1, limit = 20 } = {}) => {
    const [users, total] = await Promise.all([
        userRepo.findAll({}, { page, limit }),
        userRepo.countAll(),
    ]);
    return { users, total, page: Number(page), limit: Number(limit) };
};

export const deactivateUser = async (userId) => {
    const user = await userRepo.updateById(userId, { isActive: false });
    if (!user) throw new AppError("User not found", 404);
    return user;
};