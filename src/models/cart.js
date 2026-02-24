import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product:       { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity:      { type: Number, required: true, min: 1, default: 1 },
    selectedSize:  { type: String, required: true },
    selectedColor: { type: String, required: true },
    priceAtAdd:    { type: Number, required: true },
}, { _id: true });

const cartSchema = new mongoose.Schema({
    user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

cartSchema.virtual("totalPrice").get(function () {
    return this.items.reduce((total, item) => total + item.priceAtAdd * item.quantity, 0);
});

cartSchema.virtual("totalItems").get(function () {
    return this.items.reduce((count, item) => count + item.quantity, 0);
});

export default mongoose.model("Cart", cartSchema);