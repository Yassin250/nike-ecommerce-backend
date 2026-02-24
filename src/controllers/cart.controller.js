import * as cartService from "../services/cart.service.js";
import { successResponse } from "../utils/apiResponse.js";

export const getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.user._id);
        return successResponse(res, {
            message: "Cart fetched successfully",
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

export const addItem = async (req, res, next) => {
    try {
        const cart = await cartService.addItem(req.user._id, req.body);
        return successResponse(res, {
            message: "Item added to cart",
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

export const updateItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const cart = await cartService.updateItem(req.user._id, itemId, quantity);
        const message = quantity === 0 ? "Item removed" : "Cart updated";
        return successResponse(res, {
            message,
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

export const removeItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const cart = await cartService.removeItem(req.user._id, itemId);
        return successResponse(res, {
            message: "Item removed",
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        await cartService.clearCart(req.user._id);
        return successResponse(res, {
            message: "Cart cleared"
        });
    } catch (err) {
        next(err);
    }
};