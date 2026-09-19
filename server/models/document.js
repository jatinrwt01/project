import mongoose from "mongoose"

const documentSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
         extension:{
            type: String,
            required: true
        },
        workspaceId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true
        },
        status:{
            type: String,
            enum: ["uploading", "processing", "ready", "failed"],
            default: "uploading"
        },
        storageLocation:{
            type: String,
            required: true
        }
    },
    {timestamps: true}
);


const documentModel = mongoose.model("Document", documentSchema);
export default documentModel;