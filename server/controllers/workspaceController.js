import workspaceModel from "../models/workspace.js";

export const createWorkspace = async(req,res)=>{
    try{
        const {name} = req.body;
        if(!name || name.trim() === ""){
            return res.status(400).json({
                message:"Workspace name is required"
            });
        }

        const workspace = await workspaceModel.create({
            name:name.trim(),
            userId: req.user
        });

        return res.status(201).json({
            message:"Workspace created successfully",
            workspace
        });
    } catch(err){
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong!"
        });
    }
};


export const getWorkspaces = async(req, res)=>{
    try{
        const workspaces = await workspaceModel.find({
            userId: req.user
        });
        return res.status(200).json({
            workspaces
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


export const getWorkspace = async(req, res)=>{
    try{
        const { workspaceId } = req.params;
        const workspace = await workspaceModel.findOne({
            _id: workspaceId,
            userId: req.user
        });

        if(!workspace){
            return res.status(404).json({
                message: "Workspace not found"
            });
        }
        return res.status(200).json({
            workspace
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


export const updateWorkspace = async(req, res)=>{
    try{
        const { workspaceId } = req.params;
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Workspace name is required"
            });
        }

        const workspace = await workspaceModel.findOneAndUpdate(
            {
                _id: workspaceId,
                userId: req.user
            },
            {
                name: name.trim()
            },
            {
                new: true
            }
        );

        if(!workspace){
            return res.status(404).json({
                message: "Workspace not found"
            });
        }
        return res.status(200).json({
            message: "Workspace updated successfully",
            workspace
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


export const deleteWorkspace = async(req, res)=>{
    try{
        const { workspaceId } = req.params;
        const workspace = await workspaceModel.findOneAndDelete({
            _id: workspaceId,
            userId: req.user
        });

        if(!workspace){
            return res.status(404).json({
                message: "Workspace not found"
            });
        }
        return res.status(200).json({
            message: "Workspace deleted successfully"
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};