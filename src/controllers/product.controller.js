import * as productService from "../services/product.service.js";
import { successResponse, paginatedResponse } from "../utils/apiResponse.js";

export const getProducts = async (req, res, next) => {
    try {
        const { products, total, page, limit } = await productService.getProducts(req.query);
        return paginatedResponse(res, { data: products, total, page, limit });
    } catch (err) { next(err); }
};

export const getProduct = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        return successResponse(res, { data: product });
    } catch (err) { next(err); }
};