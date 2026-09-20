import documentModel from "../models/document.js";
import verifyWorkspaceOwnership from "../services/workspaceService.js";
import {uploadToCloudinary, deleteFromCloudinary} from "../services/cloudinaryService.js";
import fs from "fs/promises";
import mongoose from "mongoose";

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
            storageLocation: result.secure_url,
            cloudinaryPublicId: result.public_id
        });
        console.log("Temporary file:", req.file.path);
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

export const deleteDocument = async(req, res)=>{
    try{
        const { documentId } = req.params;
        if(!mongoose.Types.ObjectId.isValid(documentId)){
             return res.status(400).json({
                message: "Invalid document ID"
             });
        }
        const document = await documentModel.findById(documentId);
        if(!document){
            return res.status(404).json({
                message: "Document not found"
            });
        }
        const workspace = await verifyWorkspaceOwnership(
            document.workspaceId,
            req.user
        );
        if(!workspace){
            return res.status(404).json({
                message: "Document not found"
            });
        }
        await deleteFromCloudinary(document.cloudinaryPublicId);

        await documentModel.findByIdAndDelete(documentId);

        return res.status(200).json({
            message: "Document deleted successfully"
        });

    }catch(error){
        console.log("DOCUMENT DELETE ERROR:", error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

export const getWorkspaceDocuments = async(req, res)=>{
    try{
        const { workspaceId } = req.params;
        if(!mongoose.Types.ObjectId.isValid(workspaceId)){
            return res.status(400).json({
                message: "Invalid workspace ID"
            });
        }
        const workspace = await verifyWorkspaceOwnership(
            workspaceId,
            req.user
        );

        if(!workspace){
            return res.status(404).json({
                message: "Workspace not found"
            });
        }
        const documents = await documentModel
            .find({ workspaceId })
            .sort({ createdAt: -1 });
        return res.status(200).json({
            documents
        });

    } catch(error){
        console.log("GET WORKSPACE DOCUMENTS ERROR:", error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

export const getDocument = async(req, res) =>{
    try{
        const { documentId } = req.params;
        if(!mongoose.Types.ObjectId.isValid(documentId)){
            return res.status(400).json({
                message: "Invalid document ID"
            });
        }
        const document = await documentModel.findById(documentId);
        if(!document){
            return res.status(404).json({
                message: "Document not found"
            });
        }
        const workspace = await verifyWorkspaceOwnership(
            document.workspaceId,
            req.user
        );

        if(!workspace){
            return res.status(404).json({
                message: "Document not found"
            });
        }
        return res.status(200).json({
            document
        });

    }catch(error){
        console.log("GET DOCUMENT ERROR:", error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};