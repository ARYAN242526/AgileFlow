import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    goal: {
        type: String,
        trim: true,
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },

    startDate: {
        type: Date,
    },

    endDate: {
        type: Date,
    },

    status: {
        type: String,
        enum: ["planned" , "active" , "completed"],
        default: "planned",
    },
} , {timestamps : true});

// Prevent duplicate sprint names per project
sprintSchema.index({ name : 1 , project: 1} , { unique: true});

export const Sprint = mongoose.model("Sprint" , sprintSchema);