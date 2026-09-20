import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadDocument, deleteDocument } from "../controllers/documentController.js";

const router = express.Router();

router.post(
    "/:workspaceId",
    authMiddleware,
    upload.single("file"),
    uploadDocument
);

router.delete(
    "/:documentId",
    authMiddleware,
    deleteDocument
);

export default router;