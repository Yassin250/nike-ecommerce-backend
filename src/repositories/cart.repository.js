import Cart from "../models/cart.js";

export const findByUser = (userId) =>
    Cart.findOne({ user: userId }).populate("items.product", "name image images price inStock sizes colors");

export const createForUser = (userId) => Cart.create({ user: userId, items: [] });
export const updateById = (id, data) => 
    Cart.findByIdAndUpdate(id, data, { 
        returnDocument: 'after',  // ← CHANGE THIS
        runValidators: true 
    });

export const findOrCreateForUser = async (userId) => {
    let cart = await findByUser(userId);
    if (!cart) cart = await createForUser(userId);
    return cart;
};

export const save         = (cart)   => cart.save();
export const clearByUser  = (userId) => Cart.findOneAndUpdate({ user: userId }, { items: [] }, { returnDocument: 'after' });