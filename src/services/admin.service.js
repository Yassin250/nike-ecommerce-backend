import * as adminRepo from "../repositories/admin.repository.js";
import * as productService from "./product.service.js";
import * as userRepo from "../repositories/user.repository.js";
import * as orderRepo from "../repositories/order.repository.js";
import * as productRepo from "../repositories/product.repository.js";
import { AppError } from "../middleware/errorHandler.js";

// ==================== PRODUCTS ====================

export const getAllProducts = async (query) => {
    // Admin can see ALL products (including inactive)
    const { page = 1, limit = 20, sort = "newest", ...filters } = query;
    
    const sortMap = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        "price-asc": { price: 1 },
        "price-desc": { price: -1 },
    };

    // Remove inStock filter for admin - they see everything
    const filter = productRepo.buildFilter(filters);
    delete filter.inStock; // Admin sees all products
    
    const sortOption = sortMap[sort] || sortMap.newest;

    const [products, total] = await Promise.all([
        productRepo.findAll(filter, { page, limit, sort: sortOption }),
        productRepo.countAll(filter),
    ]);

    return { products, total, page: Number(page), limit: Number(limit) };
};

export const createProduct = async (productData) => {
    return await productRepo.create(productData);
};

export const updateProduct = async (id, updates) => {
    const product = await productRepo.updateById(id, updates);
    if (!product) throw new AppError("Product not found", 404);
    return product;
};

export const deleteProduct = async (id) => {
    // Soft delete - mark as out of stock
    const product = await productRepo.updateById(id, { inStock: false });
    if (!product) throw new AppError("Product not found", 404);
    return product;
};

export const hardDeleteProduct = async (id) => {
    // Actually delete from database
    const product = await productRepo.deleteById(id);
    if (!product) throw new AppError("Product not found", 404);
    return product;
};

// ==================== ORDERS ====================

export const getAllOrders = async ({ page = 1, limit = 20, status } = {}) => {
    const filter = status ? { orderStatus: status } : {};
    
    const [orders, total] = await Promise.all([
        orderRepo.findAll(filter, { page, limit }),
        orderRepo.countAll(filter),
    ]);

    return { orders, total, page: Number(page), limit: Number(limit) };
};

export const updateOrderStatus = async (orderId, { status, notes }) => {
    const update = {};
    
    if (status) {
        update.orderStatus = status;
        if (status === "delivered") update.deliveredAt = new Date();
        if (status === "cancelled") update.cancelledAt = new Date();
    }
    
    if (notes) update.notes = notes;

    const order = await orderRepo.updateById(orderId, update);
    if (!order) throw new AppError("Order not found", 404);

    return order;
};

export const getOrderDetails = async (orderId) => {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    return order;
};

// ==================== USERS ====================

export const getAllUsers = async ({ page = 1, limit = 20, role, isActive } = {}) => {
    const filter = {};
    if (role) filter.role = role;
    if (typeof isActive === "boolean") filter.isActive = isActive;

    const [users, total] = await Promise.all([
        userRepo.findAll(filter, { page, limit }),
        userRepo.countAll(filter),
    ]);

    return { users, total, page: Number(page), limit: Number(limit) };
};

export const updateUserRole = async (userId, role) => {
    if (!["user", "admin"].includes(role)) {
        throw new AppError("Invalid role", 400);
    }

    const user = await userRepo.updateById(userId, { role });
    if (!user) throw new AppError("User not found", 404);

    return user;
};

export const toggleUserStatus = async (userId, isActive) => {
    const user = await userRepo.updateById(userId, { isActive });
    if (!user) throw new AppError("User not found", 404);

    return user;
};

export const getUserDetails = async (userId) => {
    const user = await userRepo.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user;
};

// ==================== ANALYTICS ====================

export const getDashboardAnalytics = async () => {
    const [
        dashboardStats,
        revenueStats,
        revenueByDay,
        topProducts,
        recentUsers,
        ordersByStatus,
        userGrowth,
    ] = await Promise.all([
        adminRepo.getDashboardStats(),
        adminRepo.getRevenueStats(),
        adminRepo.getRevenueByPeriod(30),
        adminRepo.getTopProducts(5),
        adminRepo.getRecentUsers(5),
        adminRepo.getOrdersByStatus(),
        adminRepo.getUserGrowth(30),
    ]);

    const stats = revenueStats[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
    };

    return {
        ...dashboardStats,
        ...stats,
        revenueByDay,
        topProducts,
        recentUsers,
        ordersByStatus,
        userGrowth,
    };
};

export const getRevenueAnalytics = async (days = 30) => {
    const [revenueStats, revenueByDay] = await Promise.all([
        adminRepo.getRevenueStats(),
        adminRepo.getRevenueByPeriod(days),
    ]);

    const stats = revenueStats[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
    };

    return {
        ...stats,
        revenueByDay,
    };
};

export const getProductAnalytics = async () => {
    const [topProducts, totalProducts, inStockCount, outOfStockCount] = await Promise.all([
        adminRepo.getTopProducts(10),
        productRepo.countAll(),
        productRepo.countAll({ inStock: true }),
        productRepo.countAll({ inStock: false }),
    ]);

    return {
        totalProducts,
        inStockCount,
        outOfStockCount,
        topProducts,
    };
};

export const getUserAnalytics = async (days = 30) => {
    const [totalUsers, activeUsers, userGrowth, recentUsers] = await Promise.all([
        userRepo.countAll(),
        userRepo.countAll({ isActive: true }),
        adminRepo.getUserGrowth(days),
        adminRepo.getRecentUsers(10),
    ]);

    return {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        userGrowth,
        recentUsers,
    };
};