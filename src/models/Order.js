import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product:       { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name:          { type: String, required: true },
    image:         { type: String, required: true },
    selectedSize:  { type: String, required: true },
    selectedColor: { type: String, required: true },
    quantity:      { type: Number, required: true, min: 1 },
    price:         { type: Number, required: true },
});

const shippingAddressSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true },
    phone:     { type: String, required: true },
    address:   { type: String, required: true },
    city:      { type: String, required: true },
    state:     { type: String, required: true },
    zipCode:   { type: String, required: true },
    country:   { type: String, default: "India" },
});

const orderSchema = new mongoose.Schema({
    user:                  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber:           { type: String, unique: true },
    items:                 [orderItemSchema],
    shippingAddress:       { type: shippingAddressSchema, required: true },
    paymentMethod:         { type: String, enum: ["card", "upi", "cod", "stripe"], required: true },
    paymentStatus:         { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    stripePaymentIntentId: { type: String, default: null },
    orderStatus:           { type: String, enum: ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"], default: "placed" },
    subtotal:              { type: Number, required: true },
    shippingCost:          { type: Number, default: 0 },
    tax:                   { type: Number, default: 0 },
    total:                 { type: Number, required: true },
    notes:                 { type: String, default: null },
    cancelledAt:           { type: Date, default: null },
    deliveredAt:           { type: Date, default: null },
}, { timestamps: true });

orderSchema.pre("save", function () {
    if (!this.orderNumber) {
        const ts  = Date.now().toString(36).toUpperCase();
        const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.orderNumber = `ORD-${ts}-${rnd}`;
    }
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
// orderNumber index is created automatically by unique: true

export default mongoose.model("Order", orderSchema);