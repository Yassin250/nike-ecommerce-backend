import Product from "../models/product.js";

export const findById   = (id)            => Product.findById(id);
export const create     = (data)          => Product.create(data);
export const deleteById = (id)            => Product.findByIdAndDelete(id);
export const countAll   = (filter = {})   => Product.countDocuments(filter);
export const updateById = (id, data) => 
    Product.findByIdAndUpdate(id, data, { 
        returnDocument: 'after',  // ← CHANGE THIS
        runValidators: true 
    });

export const findAll = (filter = {}, { page = 1, limit = 20, sort = { createdAt: -1 } } = {}) =>
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit);

export const buildFilter = ({ category, gender, badge, search, minPrice, maxPrice, inStock, featured }) => {
    const filter = { inStock: true }; // Changed from isActive to inStock
    
    if (category)  filter.category = category.toLowerCase();
    if (gender)    filter.gender = gender.toLowerCase();
    if (badge)     filter.badge = badge.toLowerCase();
    if (featured === "true") filter.featured = true;
    
    if (search)    filter.$text = { $search: search };
    
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (inStock === "false") {
        delete filter.inStock; // Remove default filter
        filter.inStock = false;
    }
    
    return filter;
};