import * as productRepo from "../repositories/product.repository.js";
import { AppError } from "../middleware/errorHandler.js";

const sortMap = {
    newest:       { createdAt: -1 },
    oldest:       { createdAt: 1 },
    "price-asc":  { price: 1 },
    "price-desc": { price: -1 },
    popular:      { "rating.count": -1 },
};

export const getProducts = async (query) => {
    const { page = 1, limit = 20, sort = "newest", ...filters } = query;
    const filter     = productRepo.buildFilter(filters);
    const sortOption = sortMap[sort] || sortMap.newest;

    const [products, total] = await Promise.all([
        productRepo.findAll(filter, { page, limit, sort: sortOption }),
        productRepo.countAll(filter),
    ]);
    return { products, total, page: Number(page), limit: Number(limit) };
};

export const getProductById = async (id) => {
    const product = await productRepo.findById(id);
    if (!product) throw new AppError("Product not found", 404);
    if (!product.inStock) throw new AppError("Product is out of stock", 404);
    return product;
};

export const createProduct = (data)      => productRepo.create(data);

export const updateProduct = async (id, data) => {
    const product = await productRepo.updateById(id, data);
    if (!product) throw new AppError("Product not found", 404);
    return product;
};

export const deleteProduct = async (id) => {
    const product = await productRepo.updateById(id, { inStock: false });
    if (!product) throw new AppError("Product not found", 404);
    return product;
};