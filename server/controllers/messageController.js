import messageModel from "../models/message.js";
import conversationModel from "../models/conversation.js";

const verifyConversationOwnership = async(conversationId, userId)=>{
    const conversation = await conversationModel.findOne({
        _id: conversationId,
        userId: userId,
    });
    return conversation;
};

export const createMessage = async(req, res)=>{
    try{
        const { conversationId } = req.params;
        const { role, content } = req.body;
        const conversation = await verifyConversationOwnership(
            conversationId,
            req.user.userId
        );

        if(!conversation){
            return res.status(404).json({
                message: "Conversation not found",
            });
        }
        if(!role || !["user", "assistant"].includes(role)){
            return res.status(400).json({
                message: "Invalid message role",
            });
        }
        if(!content || !content.trim()){
            return res.status(400).json({
                message: "Message content is required",
            });
        }
        const message = await messageModel.create({
            conversationId,
            role,
            content: content.trim(),
        });

        await conversationModel.findByIdAndUpdate(
            conversationId,
            {
                updatedAt: new Date(),
            }
        );

        return res.status(201).json({
            message: "Message created successfully",
            data: message,
        });

    }catch(error){
        console.log("MESSAGE CREATE ERROR:", error);
        return res.status(500).json({
            message: "Failed to create message",
        });
    }
};

export const getConversationMessages = async(req, res)=>{
    try{
        const { conversationId } = req.params;
        const conversation = await verifyConversationOwnership(
            conversationId,
            req.user.userId
        );
        if(!conversation){
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        const messages = await messageModel
            .find({
                conversationId,
            })
            .sort({ createdAt: 1 });

        return res.status(200).json({
            messages,
        });

    }catch(error){
        console.log("GET MESSAGES ERROR:", error);
        return res.status(500).json({
            message: "Failed to get messages",
        });
    }
};
