import stripe from "../utils/stripeClient.js";
import * as cartRepo from "../repositories/cart.repository.js";
import * as orderRepo from "../repositories/order.repository.js";
import { AppError } from "../middleware/errorHandler.js";

const SHIPPING_THRESHOLD = 14000;
const SHIPPING_COST      = 500;
const TAX_RATE           = 0.18;

export const createPaymentIntent = async (userId) => {
    const cart = await cartRepo.findByUser(userId);
    if (!cart?.items.length) throw new AppError("Cart is empty", 400);

    const subtotal     = cart.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
    const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax          = Math.round(subtotal * TAX_RATE);
    const total        = subtotal + shippingCost + tax;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "inr",
        metadata: { userId: userId.toString(), itemCount: String(cart.items.length) },
    });

    return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id, amount: total, breakdown: { subtotal, shippingCost, tax } };
};

export const handleWebhook = async (rawBody, signature) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        throw new AppError(`Webhook signature failed: ${err.message}`, 400);
    }

    switch (event.type) {
        case "payment_intent.succeeded":
            await orderRepo.updateById({ stripePaymentIntentId: event.data.object.id }, { paymentStatus: "paid", orderStatus: "confirmed" });
            break;
        case "payment_intent.payment_failed":
            await orderRepo.updateById({ stripePaymentIntentId: event.data.object.id }, { paymentStatus: "failed" });
            break;
        default:
            console.log(`Unhandled Stripe event: ${event.type}`);
    }
    return { received: true };
};