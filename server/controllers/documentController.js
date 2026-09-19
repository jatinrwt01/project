import documentModel from "../models/document.js";
import verifyWorkspaceOwnership from "../services/workspaceService.js";
import uploadToCloudinary from "../services/cloudinaryService.js";
import fs from "fs/promises";

export const uploadDocument = async(req, res)=>{
    try{
        const { workspaceId } = req.params;
        if(!req.file){
            return res.status(400).json({
                message: "No file uploaded"
            });
        }
        const workspace = await verifyWorkspaceOwnership(
            workspaceId,
            req.user
        );
        if(!workspace){
            await fs.unlink(req.file.path);
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        const result = await uploadToCloudinary(req.file.path);
        const document = await documentModel.create({
            name: req.file.originalname,
            extension: req.file.originalname.substring(
                req.file.originalname.lastIndexOf(".")
            ),
            workspaceId,
            status: "ready",
            storageLocation: result.secure_url
        });

        await fs.unlink(req.file.path);

        return res.status(201).json({
            message: "Document uploaded successfully",
            document
        });

    }catch(error){
        console.log("DOCUMENT UPLOAD ERROR:", error);

        if(req.file){
            try{
                await fs.unlink(req.file.path);
            }catch(unlinkError){
                console.log("Failed to delete temporary file:", unlinkError);
            }
        }

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};