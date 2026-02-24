import * as orderService from "../services/order.service.js";
import { successResponse, createdResponse } from "../utils/apiResponse.js";

export const createOrder = async (req, res, next) => { try { return createdResponse(res, { message: "Order placed", data: await orderService.createOrder(req.user._id, req.body) }); } catch (err) { next(err); } };
export const getOrders   = async (req, res, next) => { try { return successResponse(res, { data: await orderService.getUserOrders(req.user._id, req.query) }); } catch (err) { next(err); } };
export const getOrder    = async (req, res, next) => { try { return successResponse(res, { data: await orderService.getOrderById(req.user._id, req.params.id) }); } catch (err) { next(err); } };