import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createWorkspace, getWorkspaces, getWorkspace } from "../controllers/workspaceController.js";

const router = express.Router();

router.post("/", authMiddleware, createWorkspace);
router.get("/", authMiddleware, getWorkspaces);
router.get("/:workspaceId", authMiddleware, getWorkspace);

export default router;