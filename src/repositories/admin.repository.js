import User from "../models/user.js";
import Order from "../models/Order.js";
import Product from "../models/product.js";

// Admin-specific queries that aggregate data across multiple models

export const getDashboardStats = async () => {
    const [totalUsers, totalProducts, totalOrders, activeUsers] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments({ isActive: true }),
    ]);

    return {
        totalUsers,
        totalProducts,
        totalOrders,
        activeUsers,
    };
};

export const getRevenueStats = () =>
    Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$total" },
                totalOrders: { $count: {} },
                avgOrderValue: { $avg: "$total" },
            },
        },
    ]);

export const getRevenueByPeriod = (days = 30) =>
    Order.aggregate([
        {
            $match: {
                paymentStatus: "paid",
                createdAt: { $gte: new Date(Date.now() - days * 86400000) },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                revenue: { $sum: "$total" },
                orders: { $count: {} },
            },
        },
        { $sort: { _id: 1 } },
    ]);

export const getTopProducts = (limit = 10) =>
    Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                totalSold: { $sum: "$items.quantity" },
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
            },
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails",
            },
        },
        { $unwind: "$productDetails" },
    ]);

export const getRecentUsers = (limit = 10) =>
    User.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("-password -refreshToken");

export const getOrdersByStatus = () =>
    Order.aggregate([
        {
            $group: {
                _id: "$orderStatus",
                count: { $count: {} },
            },
        },
    ]);

export const getUserGrowth = (days = 30) =>
    User.aggregate([
        {
            $match: {
                createdAt: { $gte: new Date(Date.now() - days * 86400000) },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                newUsers: { $count: {} },
            },
        },
        { $sort: { _id: 1 } },
    ]);