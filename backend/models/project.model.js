import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Project name is required"],
        trim: true,
        maxLength: 100,
    },
    description: {
        type: String,
        trim: true,
        maxLength: 100,
    },
    status: {
        type: String,
        enum: ["planned" , "active" , "completed"],
        default: "planned",
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
    ],
} , {timestamps : true});

// add index for faster search
projectSchema.index({name : 1});

export const Project = mongoose.model("Project" , projectSchema);