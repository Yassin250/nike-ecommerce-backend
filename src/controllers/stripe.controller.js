import * as paymentService from "../services/payment.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const createPaymentIntent = async (req, res, next) => {
    try {
        return successResponse(res, { data: await paymentService.createPaymentIntent(req.user._id) });
    } catch (err) { next(err); }
};

export const handleWebhook = async (req, res, next) => {
    try {
        const sig = req.headers["stripe-signature"];
        if (!sig) return errorResponse(res, { message: "Missing stripe signature", statusCode: 400 });
        return successResponse(res, { data: await paymentService.handleWebhook(req.body, sig) });
    } catch (err) { next(err); }
};