import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";


async function registerUserController(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ 
            message: "All fields are required" });
    }

    const isUserAlreadyExists = await userModel.findOne({ 
        $or: [{ username }, { email }]
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({ 
            message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })
}


async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email});
     if(!user){
        return res.status(400).json({ message: "Invalid email or password" });
     }

     const isPasswordValid = await bcrypt.compare(password, user.password);
     if(!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
     }

     const token = jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })
}

// has to implement token blacklisting for logout withn redis and something throughput
async function logoutUserController(req, res) {
    const  token  = req.cookies.token;

    if(token) {
        await tokenBlacklistModel.create({ token });
    }
        res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully" }); 
}

//
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })

}

export {registerUserController, 
        loginUserController, 
        logoutUserController,
    getMeController};