import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { generateToken } from '../utils/createToken.js';

const registerUser = asyncHandler(async (req,res) => {
    const {name, email, password, role} = req.body;

    if(
        [name , email , password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400 , "All fields are required");
    }

    // check if user already exists
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res
                .status(400)
                .json(new ApiResponse(400 , null, "User already exists"));
    }

    // create new user
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    const token = generateToken(user._id);

    const createdUser = await User.findById(user._id).select("-password")

    if(!createdUser){
        throw new ApiError(500 , "Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(
        201,
        {
        user: createdUser,
        token,
        },
        "User registered successfully"
    ));
})

const loginUser = asyncHandler(async(req,res) => {
    const {email , password} = req.body;

    if(!email || !password) {
        throw new ApiError(400 , "All fields are required");
    }

    const user = await User.findOne({email}).select("+password");

    if(!user) {
        throw new ApiError(400 , "Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid){
        throw new ApiError(400 , "Invalid credentials");
    }

    const token = generateToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                user : loggedInUser,
                token
            },
            "User logged in successfully"
        )
    );
});

const logoutUser = asyncHandler(async(req,res) => {
    return res.status(200).json(
        new ApiResponse(200 , null , "User logged out successfully")
    );
});

export {registerUser, loginUser, logoutUser};