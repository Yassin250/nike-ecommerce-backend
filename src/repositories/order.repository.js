import Order from "../models/Order.js";

// ✅ FIXED: Remove async/await and let Mongoose handle it
export const create = (data) => {
    return Order.create(data);  // ← Don't use try/catch here, let it bubble up
};

export const findById = (id) => Order.findById(id).populate("user", "name email");

// ✅ FIXED: Update with returnDocument instead of new
export const updateById = (id, data) => 
    Order.findByIdAndUpdate(id, data, { 
        returnDocument: 'after', 
        runValidators: true 
    });

export const countAll = (filter = {}) => Order.countDocuments(filter);

export const findByUser = (userId, { page = 1, limit = 10 } = {}) =>
    Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

export const findByUserAndId = (userId, orderId) => 
    Order.findOne({ _id: orderId, user: userId });

export const findAll = (filter = {}, { page = 1, limit = 20, sort = { createdAt: -1 } } = {}) =>
    Order.find(filter)
        .populate("user", "name email")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);