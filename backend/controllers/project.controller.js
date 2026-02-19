import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProject = asyncHandler(async (req, res) => {
    const {name , description, startDate, endDate , members} = req.body;

    if(!name){
        throw new ApiError(400 , "Project name is required");
    }

    const project = await Project.create({
        name,
        description,
        startDate,
        endDate,
        createdBy: req.user._id,
        members,
    });

    return res
            .status(201)
            .json(new ApiResponse(201 , project, "Project created successfully"));
});

const getAllProjects = asyncHandler(async (req, res) => {
    let projects;

    if(req.user.role === "admin"){
        projects = await Project.find().populate("createdBy members" , "name email");
    } else {
        projects = await Project.find({
            $or: [
                { createdBy: req.user._id },
                { members: req.user._id },
            ],
        }).populate("createdBy members", "name email");
    }

    return res
            .status(200)
            .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate("createdBy members" , "name email");

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    return res
            .status(200)
            .json(new ApiResponse(200 , project , "Project fetched successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    // only creator or admin can update
    if(
        req.user.role !== "admin" && 
        project.createdBy.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(403 , "Not authorized to update this project");
    }

    Object.assign(project, req.body);

    await project.save();

    return res
            .status(200)
            .json(new ApiResponse(200 , project, "Project updated successfully"));
})

const deleteProject = asyncHandler(async (req, res) => {
    const project  = await Project.findById(req.params.id);

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    if(
        req.user.role !== "admin" &&
        project.createdBy.toString() !== req.user._id.toString()
    ){
        throw new ApiError(403, "Not authorized to delete this project");
    }

    await project.deleteOne();

    return res
            .status(200)
            .json(new ApiResponse(200 , null , "Project deleted successfully"));
})


export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
}