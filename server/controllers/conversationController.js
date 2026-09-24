import conversationModel from "../models/conversation.js";
import workspaceModel from "../models/workspace.js";

const verifyWorkspaceOwnership = async(workspaceId, userId)=>{
    const workspace = await workspaceModel.findOne({
        _id: workspaceId,
        userId: userId,
    });
    return workspace;
};

const createConversation = async(req, res)=>{
    try{
        const { workspaceId } = req.params;
        const { title } = req.body;
        const workspace = await verifyWorkspaceOwnership(
            workspaceId,
            req.user.userId
        );
        if(!workspace){
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        if(!title || !title.trim()){
            return res.status(400).json({
                message: "Conversation title is required",
            });
        }
        const conversation = await conversationModel.create({
            title: title.trim(),
            workspaceId,
            userId: req.user.userId,
        });
        return res.status(201).json({
            message: "Conversation created successfully",
            conversation,
        });
    } catch(error){
        console.log("CONVERSATION CREATE ERROR:", error);
        return res.status(500).json({
            message: "Failed to create conversation",
        });
    }
};

const getWorkspaceConversations = async(req, res)=>{
    try{
        const { workspaceId } = req.params;
        const workspace = await verifyWorkspaceOwnership(
            workspaceId,
            req.user.userId
        );
        if(!workspace){
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        const conversations = await conversationModel.find({
                workspaceId,
                userId: req.user.userId,
            })
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            conversations,
        });

    } catch(error){
        console.log("GET CONVERSATIONS ERROR:", error);
        return res.status(500).json({
            message: "Failed to get conversations",
        });
    }
};

const deleteConversation = async(req, res)=>{
    try{
        const { conversationId } = req.params;

        const conversation = await conversationModel.findOne({
            _id: conversationId,
            userId: req.user.userId,
        });

        if(!conversation){
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        await conversationModel.deleteOne({
            _id: conversationId,
        });

        return res.status(200).json({
            message: "Conversation deleted successfully",
        });

    } catch(error){
        console.log("CONVERSATION DELETE ERROR:", error);

        return res.status(500).json({
            message: "Failed to delete conversation",
        });
    }
};

export {
    createConversation,
    getWorkspaceConversations,
    deleteConversation,
};