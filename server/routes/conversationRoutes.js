import express from "express";
import { createConversation, getWorkspaceConversations,deleteConversation} from "../controllers/conversationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/workspace/:workspaceId",
    authMiddleware,
    createConversation
);

router.get(
    "/workspace/:workspaceId",
    authMiddleware,
    getWorkspaceConversations
);

router.delete(
    "/:conversationId",
    authMiddleware,
    deleteConversation
);

export default router;