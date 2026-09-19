import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadDocument } from "../controllers/documentController.js";

const router = express.Router();

router.post(
    "/:workspaceId",
    authMiddleware,
    upload.single("file"),
    uploadDocument
);

export default router;