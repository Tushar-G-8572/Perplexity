import dotenv from 'dotenv'
dotenv.config();
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../services/email.service.js";

export async function registerController(req, res, next) {
    const { username, email, password } = req.body;
    try {


        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "User with this email or username already exists",
                success: false,
                err: "User already exists"
            })
        }

        const user = await userModel.create({
            username,
            email,
            password
        });

        const emailVerificationToken = jwt.sign({
            email: user.email
        },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        await sendEmail({
            to: email,
            subject: "Welcome to Perplexity!",
            html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:4000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>Best regards,<br>The Perplexity Team</p>
        `
        })

        res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error while registering user" });
    }

}

export async function loginController(req, res, next) {
    try {

        const { username, email, password } = req.body
        const user = await userModel.findOne({
            $or: [{ email }, { username }]
        }).select('+password');

        if(!user){
            return res.status(400).json({
                message:"Invalid email or password",
                success:false,
                err:"User not found"
            })
        }
        const isPassword = await user.comparePassword(password);

        if(!isPassword){
            return res.status(400).json({
                message:"Invalid email or password",
                success:false,
                err:"Incorrect Password"
            })
        }

        if (!user.verified) {
            return res.status(400).json({ message: "please verify your email befor logged In",
                success:false,
                err:"Email not verified"
             })
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email
        },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        )

        res.cookie('token', token);

        res.status(200).json({
            message: "User logged in",
            success:true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error while logging user" });
    }

}

export async function resendEmailVerificationController(req,res) {
    const {email} = req.body;
    try{

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"User with this email does not exist",  
                success:false,
                err:"User not found"
            })
        }   
        if(user.verified){
            return res.status(400).json({
                message:"Email is already verified",
                success:false,
                err:"Email already verified"
            })
        }

        const emailVerificationToken = jwt.sign({
            email: user.email
        },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        await sendEmail({
            to: email,
            subject: "Email Verification - Perplexity",
            html: `
                <p>Hi ${user.username},</p>
                <p>You requested to resend the email verification link. Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:4000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>Best regards,<br>The Perplexity Team</p>
        `
        })

        res.status(200).json({
            message:"Verification email resent successfully",
            success:true
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error while resending verification email" });
    }
}

export async function verifyEmail(req,res) {
    const {token} = req.query;

    try{
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        const user = await userModel.findOne({email:decoded.email}).select("-password");

    if(!user){
        return res.status(400).json({
            message:"Invalid token",
            success:false,
            err:"User not found"
        })
    }

    if(user.verified){
        const html = `
        <h1>Email Already Verified!</h1>
        <p>Your email has already been verified. You can log in to your account.</p>
            <a href="http://localhost:4000/api/auth/login">Go to Login</a>
            `
        return res.send(html)
    }
    
    user.verified = 'true';

    user.save();
    
    const html = `
    <h1>Email Verified Successfully!</h1>
    <p>Your email has been verified. You can now log in to your account.</p>
        <a href="http://localhost:4000/api/auth/login">Go to Login</a>
        `
        
    return res.send(html);
    
}catch(err){
    return res.status(400).json({
        message:"Invalid or token expired",
        success:false,
        err:err.message
    })
}
}

export async function getMe(req,res) {
    const userId = req.user.id;
    try{

        
        const user = await userModel.findById(userId);

    if(!user) return res.status(404).json({
        message:"User not found",
        success:false,
        err:"User not found"
    })

    res.status(200).json({
        message:"User details fetched Successfully",
        success:true,
        user
    })
}catch(err){
    console.log(err);
    return res.status(400).json({message:"Error while getting user details"});
}

}

