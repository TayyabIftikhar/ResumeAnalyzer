import express from "express";
import authUsermiddleware from "../middleware/auth.middleware.js";
import {generateInterViewReportController} from "../controller/interview.controller.js";
import upload from "../middleware/file.middleware.js";

const interviewRouter = express.Router();

interviewRouter.post("/",authUsermiddleware,upload.single("resume"), generateInterViewReportController);

export default interviewRouter;