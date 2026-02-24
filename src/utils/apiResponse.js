export const successResponse = (res, { message = "Success", data = null, meta = null, statusCode = 200 } = {}) => {
    const body = { success: true, message };
    if (data !== null) body.data = data;
    if (meta !== null) body.meta = meta;
    return res.status(statusCode).json(body);
};

export const createdResponse = (res, { message = "Created", data = null } = {}) =>
    successResponse(res, { message, data, statusCode: 201 });

export const errorResponse = (res, { message = "Something went wrong", errors = null, statusCode = 500 } = {}) => {
    const body = { success: false, message };
    if (errors !== null) body.errors = errors;
    return res.status(statusCode).json(body);
};

export const notFoundResponse     = (res, message = "Resource not found") => errorResponse(res, { message, statusCode: 404 });
export const unauthorizedResponse = (res, message = "Unauthorized")        => errorResponse(res, { message, statusCode: 401 });
export const forbiddenResponse    = (res, message = "Forbidden")           => errorResponse(res, { message, statusCode: 403 });

export const validationErrorResponse = (res, errors) =>
    errorResponse(res, { message: "Validation failed", errors, statusCode: 422 });

export const paginatedResponse = (res, { data, page, limit, total, message = "Success" }) =>
    successResponse(res, {
        message, data,
        meta: {
            page: Number(page), limit: Number(limit), total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
    });