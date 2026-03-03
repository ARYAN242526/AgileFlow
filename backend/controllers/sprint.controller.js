import { Sprint } from "../models/sprint.model.js";
import { Project } from "../models/project.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSprint = asyncHandler(async (req , res) => {
    const {name, goal, startDate, endDate} = req.body;
    const {projectId} = req.params;

    if(!name){
        throw new ApiError(400 , "Sprint name is required");
    }

    const project = await Project.findById(projectId);
    if(!project){
        throw new ApiError(404 , "Project not found");
    }

    const sprint = await Sprint.create({
        name,
        goal,
        project: projectId,
        startDate,
        endDate,
    });

    return res
            .status(201)
            .json(new ApiResponse(201, sprint, "Sprint created successfully"));
});

const getProjectSprints = asyncHandler(async (req, res) => {
    const {projectId} = req.params;

    const sprints = await Sprint.find({ project: projectId });

    return res
            .status(200)
            .json(new ApiResponse(200, sprints, "Sprints fetched successfully"));
});

const startSprint = asyncHandler(async (req, res) => {
    const {sprintId} = req.params;

    const sprint = await Sprint.findById(sprintId);
    if(!sprint){
        throw new ApiError(404, "Sprint not found");
    }

    // ensure no other active sprint in same project
    const activeSprint = await Sprint.findOne({
        project: sprint.project,
        status: "active",
    });

    if(activeSprint){
        throw new ApiError(400 , "Another sprint is already active in this project");
    }

    sprint.status = "active";
    sprint.startDate = new Date();
    await sprint.save();

    return res
            .status(200)
            .json(new ApiResponse(200, sprint, "Sprint started successfully"));
});

const completeSprint = asyncHandler(async (req, res) => {
    const {sprintId} = req.params;

    const sprint = await Sprint.findById(sprintId);
    if(!sprint){
        throw new ApiError(404, "Sprint not found");
    }

    if(sprint.status !== "active"){
        throw new ApiError(400, "Only active sprint can be completed");
    }

    sprint.status = "completed";
    sprint.endDate = new Date();
    await sprint.save();

    return res
            .status(200)
            .json(new ApiResponse(200, sprint, "Sprint completed successfully"));
});

export const deleteSprint = asyncHandler(async (req, res) => {
    const {sprintId} = req.params;

    const sprint = await Sprint.findById(sprintId);
    if(!sprint){
        throw new ApiError(404, "Sprint not found");
    }

    if(sprint.status === "active"){
        throw new ApiError(400, "Cannot delete an active sprint");
    }

    await sprint.deleteOne();

    return res
            .status(200)
            .json(new ApiResponse(200, null, "Sprint deleted sucessfully"));
});

export {
    createSprint,
    getProjectSprints,
    startSprint,
    completeSprint,
    deleteSprint
}