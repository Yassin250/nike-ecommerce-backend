import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Product name is required"],
        trim: true,
        minlength: [3, "Product name must be at least 3 characters"],
        maxlength: [100, "Product name cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        minlength: [10, "Description must be at least 10 characters"]
    },
    image: { type: String, default: '' },
images: [{ type: String }],
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    originalPrice: {
        type: Number,
        min: 0,
        default: null
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ["running", "lifestyle", "basketball", "training", "soccer", "sneakers"],
        lowercase: true
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["men", "women", "unisex", "kids"],
        lowercase: true
    },
    badge: {
        type: String,
        enum: ["sale", "new", "bestseller", "just-in", null],
        default: null
    },
    images: [{
        type: String,
        required: [true, "At least one image is required"]
    }],
    image: {
        type: String,
        required: [true, "Main product image is required"]
    },
    colors: [{
        name: String,
        code: String,
        images: [String],
        inStock: { type: Boolean, default: true }
    }],
    sizes: [{
        size: String,
        inStock: { type: Boolean, default: true },
        quantity: { type: Number, default: 0 }
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    inStock: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    tags: [String],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for sale percentage
productSchema.virtual('discountPercentage').get(function() {
    if (this.originalPrice && this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ createdAt: -1 });

// ============= TEMPORARILY REMOVE ALL HOOKS =============
// We'll add them back one by one after testing

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;