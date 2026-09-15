import express from "express";
import authUsermiddleware from "../middleware/auth.middleware.js";
import {generateInterViewReportController
        ,getInterviewReportByIdController
        ,getAllInterviewReportsController
        ,generateResumePdfController
} from "../controller/interview.controller.js";
import upload from "../middleware/file.middleware.js";

const interviewRouter = express.Router();

interviewRouter.post("/",authUsermiddleware,upload.single("resume"), generateInterViewReportController);
interviewRouter.get("/report/:interviewId",authUsermiddleware, getInterviewReportByIdController);
interviewRouter.get("/",authUsermiddleware, getAllInterviewReportsController);

interviewRouter.post("/resume/pdf/:interviewReportId",authUsermiddleware,generateResumePdfController);

export default interviewRouter;