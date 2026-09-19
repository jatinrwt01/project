import workspaceModel from "../models/workspace.js";

const verifyWorkspaceOwnership = async(workspaceId, userId)=>{
    const workspace = await workspaceModel.findOne({
        _id: workspaceId,
        userId: userId
    });
    return workspace;
};

export default verifyWorkspaceOwnership;