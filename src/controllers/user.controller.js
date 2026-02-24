import * as userService from "../services/user.service.js";
import { successResponse } from "../utils/apiResponse.js";

export const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user._id);
        return successResponse(res, { data: user });
    } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user._id, req.body);
        return successResponse(res, { message: "Profile updated", data: user });
    } catch (err) { next(err); }
};

export const changePassword = async (req, res, next) => {
    try {
        await userService.changePassword(req.user._id, req.body);
        return successResponse(res, { message: "Password changed successfully" });
    } catch (err) { next(err); }
};