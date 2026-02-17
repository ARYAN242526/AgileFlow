import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMe = asyncHandler(async (req, res) => {
    
    return res.status(201).json(
        new ApiResponse(
            201,
            req.user,
            "User profile fetched successfully"
        )
    );
});

const updateProfile = asyncHandler(async (req, res) => {

    const {name , password} = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if(!user){
        throw new ApiError(404 , "User not found");
    }

    if(name) user.name = name;
    if(password) user.password = password; // hashed automatically by pre-save

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    return res.status(201).json(
        new ApiResponse(
            201,
            updatedUser,
            "User Profile updated successsfully"
        )
    );
});

const getAllUsers = asyncHandler(async (req,res) => {
    const users  = await User.find().select("-password");

    return res.status(201).json(
        new ApiResponse(
            201,
            users,
            "Users fetched successfully"
        )
    );
});

const getUserById = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id).select("-password");

    if(!user){
        throw new ApiError(404,  "User not found");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            user,
            "User fetched successfully"
        )
    );
});

const updateUserRole = asyncHandler(async (req, res) => {

    const { role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.role = role;
    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "User role updated successfully"
        )
    );
});

const deleteUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await user.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "User deleted successfully"
        )
    );
});

export {
    getMe,
    updateProfile,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
};