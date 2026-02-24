import { validationErrorResponse } from "../utils/apiResponse.js";

export const validateRequest = (schema) => (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
        const ruleList = rules.split("|");
        const value = req.body[field];

        for (const rule of ruleList) {
            if (rule === "required" && (value === undefined || value === null || value === "")) {
                errors.push({ field, message: `${field} is required` });
                break;
            }
            if (value === undefined || value === null || value === "") continue;
            if (rule === "email" && !/^\S+@\S+\.\S+$/.test(value))
                errors.push({ field, message: `${field} must be a valid email` });
            if (rule.startsWith("min:")) {
                const min = Number(rule.split(":")[1]);
                if (typeof value === "string" && value.length < min)
                    errors.push({ field, message: `${field} must be at least ${min} characters` });
            }
            if (rule.startsWith("max:")) {
                const max = Number(rule.split(":")[1]);
                if (typeof value === "string" && value.length > max)
                    errors.push({ field, message: `${field} cannot exceed ${max} characters` });
            }
        }
    }

    if (errors.length > 0) return validationErrorResponse(res, errors);
    next();
};

export const schemas = {
    register:      { name: "required|string|min:2|max:50", email: "required|email", password: "required|string|min:6" },
    login:         { email: "required|email", password: "required|string" },
    createProduct: { name: "required|string|max:100", description: "required|string", price: "required|number", category: "required|string" },
    addToCart:     { productId: "required|string", quantity: "required|number", selectedSize: "required|string", selectedColor: "required|string" },
};