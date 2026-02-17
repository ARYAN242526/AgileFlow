import jwt from 'jsonwebtoken';

// generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        {id : userId} , 
        process.env.JWT_SECRET,
        {
            expiresIn : "7d",
        }
    );
}

export {generateToken}