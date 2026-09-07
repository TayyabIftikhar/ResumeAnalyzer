import express from "express";
import authUsermiddleware from "../middleware/auth.middleware.js";
import {registerUserController,
        loginUserController,
        logoutUserController,
        getMeController} from "../controller/auth.controller.js";


const authRouter = express.Router();

authRouter.post("/register",registerUserController);
authRouter.post("/login",loginUserController);
authRouter.get("/logout",logoutUserController);

authRouter.get("/get-me",authUsermiddleware,getMeController); 

export default authRouter;