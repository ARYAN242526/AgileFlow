import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const authenticate = asyncHandler(async(req, res, next) => {
    let token;

    // get token from authorization header
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        token = req.headers.authorization.split(" ")[1];
    }
    // if not token
    if(!token){
        throw new ApiError(401 , "Not authorized , token missing");
    }

    // verify token
    let decoded;
    try {
        decoded = jwt.verify(token , process.env.JWT_SECRET);
    } catch (error) {
        throw new ApiError(401,  "Invalid or expired token");
    }

    // FInd user from DB
    const user = await User.findById(decoded.id).select("-password");

    if(!user){
        throw new ApiError(401 , "user not found");
    }

    // Attach user to request
    req.user= user;
    next();
});

export {authenticate};