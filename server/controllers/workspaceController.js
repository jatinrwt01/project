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