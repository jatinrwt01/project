import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js"

export const register = async (req, res) => {
    try{
        const{email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            email,
            hashedPassword
        });

        return res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


export const login = async(req, res)=>{
    try{
        const{email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await userModel.findOne({ email });

        if(!user){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.hashedPassword
        );
        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" }
        );
        return res.status(200).json({
            message: "Login successful",
            token
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};