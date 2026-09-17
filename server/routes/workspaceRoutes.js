import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createWorkspace, getWorkspaces, getWorkspace, updateWorkspace, deleteWorkspace } from "../controllers/workspaceController.js";

const router = express.Router();

router.post("/", authMiddleware, createWorkspace);
router.get("/", authMiddleware, getWorkspaces);
router.get("/:workspaceId", authMiddleware, getWorkspace);
router.patch("/:workspaceId", authMiddleware, updateWorkspace);
router.delete("/:workspaceId", authMiddleware, deleteWorkspace);

export default router;