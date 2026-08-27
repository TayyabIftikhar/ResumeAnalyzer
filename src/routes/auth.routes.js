import express from "express";
import registerUserController from "../controller/auth.controller.js";


const authRouter = express.Router();

authRouter.post("/register",registerUserController);

export default authRouter;