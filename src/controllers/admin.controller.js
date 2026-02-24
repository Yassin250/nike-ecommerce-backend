import * as adminService from "../services/admin.service.js";
import { successResponse, createdResponse, paginatedResponse } from "../utils/apiResponse.js";

// ==================== PRODUCTS ====================

export const getProducts = async (req, res, next) => {
    try {
        const { products, total, page, limit } = await adminService.getAllProducts(req.query);
        return paginatedResponse(res, { data: products, total, page, limit });
    } catch (err) { next(err); }
};

export const createProduct = async (req, res, next) => {
    try {
        const product = await adminService.createProduct(req.body);
        return createdResponse(res, { message: "Product created", data: product });
    } catch (err) { next(err); }
};

export const updateProduct = async (req, res, next) => {
    try {
        const product = await adminService.updateProduct(req.params.id, req.body);
        return successResponse(res, { message: "Product updated", data: product });
    } catch (err) { next(err); }
};

export const deleteProduct = async (req, res, next) => {
    try {
        await adminService.deleteProduct(req.params.id);
        return successResponse(res, { message: "Product deleted" });
    } catch (err) { next(err); }
};

// ==================== ORDERS ====================

export const getOrders = async (req, res, next) => {
    try {
        const { orders, total, page, limit } = await adminService.getAllOrders(req.query);
        return paginatedResponse(res, { data: orders, total, page, limit });
    } catch (err) { next(err); }
};

export const updateOrder = async (req, res, next) => {
    try {
        const order = await adminService.updateOrderStatus(req.params.id, req.body);
        return successResponse(res, { message: "Order updated", data: order });
    } catch (err) { next(err); }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await adminService.getOrderDetails(req.params.id);
        return successResponse(res, { data: order });
    } catch (err) { next(err); }
};

// ==================== USERS ====================

export const getUsers = async (req, res, next) => {
    try {
        const { users, total, page, limit } = await adminService.getAllUsers(req.query);
        return paginatedResponse(res, { data: users, total, page, limit });
    } catch (err) { next(err); }
};

export const updateUser = async (req, res, next) => {
    try {
        const { role, isActive } = req.body;
        
        let user;
        if (role) {
            user = await adminService.updateUserRole(req.params.id, role);
        } else if (typeof isActive === "boolean") {
            user = await adminService.toggleUserStatus(req.params.id, isActive);
        }
        
        return successResponse(res, { message: "User updated", data: user });
    } catch (err) { next(err); }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await adminService.getUserDetails(req.params.id);
        return successResponse(res, { data: user });
    } catch (err) { next(err); }
};

// ==================== ANALYTICS ====================

export const getAnalytics = async (req, res, next) => {
    try {
        const analytics = await adminService.getDashboardAnalytics();
        return successResponse(res, { data: analytics });
    } catch (err) { next(err); }
};

export const getRevenueAnalytics = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const analytics = await adminService.getRevenueAnalytics(days);
        return successResponse(res, { data: analytics });
    } catch (err) { next(err); }
};

export const getProductAnalytics = async (req, res, next) => {
    try {
        const analytics = await adminService.getProductAnalytics();
        return successResponse(res, { data: analytics });
    } catch (err) { next(err); }
};

export const getUserAnalytics = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const analytics = await adminService.getUserAnalytics(days);
        return successResponse(res, { data: analytics });
    } catch (err) { next(err); }
};