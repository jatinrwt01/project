import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadDocument, deleteDocument, getWorkspaceDocuments, getDocument } from "../controllers/documentController.js";

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

router.get(
    "/workspace/:workspaceId",
    authMiddleware,
    getWorkspaceDocuments
);

router.get(
    "/:documentId",
    authMiddleware,
    getDocument
);

export default router;