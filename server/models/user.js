import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String, 
            required:true,
            unique:true
        },
        hashedPassword:{
            type:String,
            required:true
        }
    }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;