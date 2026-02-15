import mongoose from "mongoose";


const connectToDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected ! DB Host: ${connectionInstance.connection.host}`);
    } catch (err) {
        console.log('MongoDb connection failed : ' , err);
        process.exit(1);
    }
}

export default connectToDB