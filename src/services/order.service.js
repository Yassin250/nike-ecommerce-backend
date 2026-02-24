// services/order.service.js - SIMPLIFIED FOR TESTING
import * as orderRepo from "../repositories/order.repository.js";
import * as cartRepo from "../repositories/cart.repository.js";
import { AppError } from "../middleware/errorHandler.js";

export const createOrder = async (userId, { shippingAddress, paymentMethod }) => {
    try {
        console.log("1. Creating order for user:", userId);
        
        // Get cart
        const cart = await cartRepo.findByUser(userId);
        console.log("2. Cart found:", cart?._id);
        
        if (!cart?.items?.length) {
            throw new AppError("Cart is empty", 400);
        }

        // Simple order items
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name || "Product",
            image: item.product.image || "https://example.com/image.jpg",
            selectedSize: item.selectedSize || "M",
            selectedColor: item.selectedColor || "Black",
            quantity: item.quantity || 1,
            price: item.product.price || 100
        }));
        
        console.log("3. Order items prepared:", orderItems.length);

        const subtotal = orderItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const total = subtotal;

        console.log("4. Creating order in database...");
        
        // Create order WITHOUT any extra fields
        const order = await orderRepo.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus: "pending",
            subtotal,
            shippingCost: 0,
            tax: 0,
            total,
        });
        
        console.log("5. Order created:", order._id);

        // Clear cart
        await cartRepo.clearByUser(userId);
        console.log("6. Cart cleared");

        return order;
    } catch (error) {
        console.log("❌ Error in createOrder:", error.message);
        throw error;
    }
};

export const getUserOrders = (userId, options) => orderRepo.findByUser(userId, options);

export const getOrderById = async (userId, orderId) => {
    const order = await orderRepo.findByUserAndId(userId, orderId);
    if (!order) throw new AppError("Order not found", 404);
    return order;
};