import { ApiError } from "../utils/ApiError.js";

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            throw new ApiError(401, "Unauthorized access");
        }

        const hasAccess = allowedRoles.includes(req.user.role);

        if (!hasAccess) {
            throw new ApiError(403, "Access denied");
        }

        next();
    };
};

export {authorizeRoles}