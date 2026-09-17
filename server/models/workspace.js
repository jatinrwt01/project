import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }
    },
    {timestamps:true}
);

const workspaceModel = mongoose.model("Workspace", workspaceSchema);
export default workspaceModel;