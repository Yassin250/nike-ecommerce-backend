import User from "../models/user.js";

export const findById          = (id)            => User.findById(id);
export const findByEmail       = (email)         => User.findOne({ email }).select("+password +refreshToken");
export const findByIdWithToken = (id)            => User.findById(id).select("+refreshToken");
export const create            = (data)          => User.create(data);
export const updateById = (id, data) => 
    User.findByIdAndUpdate(id, data, { 
        returnDocument: 'after',  // ← CHANGE THIS
        runValidators: true 
    });
export const deleteById        = (id)            => User.findByIdAndDelete(id);
export const countAll          = (filter = {})   => User.countDocuments(filter);
export const findAll           = (filter = {}, { page = 1, limit = 20, sort = { createdAt: -1 } } = {}) =>
    User.find(filter).sort(sort).skip((page - 1) * limit).limit(limit);