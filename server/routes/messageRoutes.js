import express from "express";

import {createMessage, getConversationMessages} from "../controllers/messageController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/conversation/:conversationId",
    authMiddleware,
    createMessage
);

router.get(
    "/conversation/:conversationId",
    authMiddleware,
    getConversationMessages
);

export default router;