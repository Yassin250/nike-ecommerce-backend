import * as cartRepo from "../repositories/cart.repository.js";
import * as productRepo from "../repositories/product.repository.js";
import { AppError } from "../middleware/errorHandler.js";

export const getCart = (userId) => cartRepo.findOrCreateForUser(userId);

export const addItem = async (userId, { productId, quantity, selectedSize, selectedColor }) => {
    const product = await productRepo.findById(productId);
    if (!product) throw new AppError("Product not found", 404);
    if (!product.inStock) throw new AppError("Product is out of stock", 404);
    
    // Check if size is available
    if (product.sizes && product.sizes.length > 0) {
        const sizeObj = product.sizes.find(s => s.size === selectedSize);
        if (sizeObj && !sizeObj.inStock) {
            throw new AppError(`Size ${selectedSize} is out of stock`, 400);
        }
        if (sizeObj && sizeObj.quantity < quantity) {
            throw new AppError(`Only ${sizeObj.quantity} items left for size ${selectedSize}`, 400);
        }
    }

    const cart          = await cartRepo.findOrCreateForUser(userId);
    const existingIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
    );

    if (existingIndex > -1) {
        cart.items[existingIndex].quantity += quantity;
    } else {
        cart.items.push({ product: productId, quantity, selectedSize, selectedColor, priceAtAdd: product.price });
    }

    return cartRepo.save(cart);
};

export const updateItem = async (userId, itemId, quantity) => {
    const cart = await cartRepo.findOrCreateForUser(userId);
    const item = cart.items.id(itemId);
    if (!item) throw new AppError("Cart item not found", 404);

    if (quantity < 1) {
        item.deleteOne();
    } else {
        const product = await productRepo.findById(item.product);
        if (product?.sizes && product.sizes.length > 0) {
            const sizeObj = product.sizes.find(s => s.size === item.selectedSize);
            if (sizeObj && sizeObj.quantity < quantity) {
                throw new AppError(`Only ${sizeObj.quantity} items left in stock for this size`, 400);
            }
        }
        item.quantity = quantity;
    }
    return cartRepo.save(cart);
};

export const removeItem = async (userId, itemId) => {
    const cart = await cartRepo.findOrCreateForUser(userId);
    const item = cart.items.id(itemId);
    if (!item) throw new AppError("Cart item not found", 404);
    item.deleteOne();
    return cartRepo.save(cart);
};

export const clearCart = (userId) => cartRepo.clearByUser(userId);