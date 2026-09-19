import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async(filePath)=>{
    const response = await cloudinary.uploader.upload(filePath,{
        resource_type: "raw"
    });

    return response;
};

export default uploadToCloudinary;