import {GoogleGenAI} from "@google/genai";
import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,

});

// structurd output schema using zod different from mongodb scheme
const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("Match score range of 0 to 100, indicating how well the candidate's profile matches the job description"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("Technical questions that can be asked in the interview"),
        intention: z.string().describe("Intention of interviewer behind the question"),
        answer: z.string().describe("How to answer the question,what points to cover in the answer"),
    })).describe("Technical questions that can be asked in the interview"),
    
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("Behavioral questions that can be asked in the interview"),
        intention: z.string().describe("Intention of interviewer behind the question"),
        answer: z.string().describe("How to answer the question,what points to cover in the answer"),
    })).describe("Behavioral questions that can be asked in the interview"),
    
    skillGaps: z.array(z.object({
        skill: z.string().describe("Skill that the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("Severity of the skill gap"),
    })).describe("Skill gaps that the candidate has"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("Day number of the preparation plan"),
        focus: z.string().describe("Focus area for the day"),
        tasks: z.array(z.string()).describe("Tasks to be completed on the day"),
    })).describe("Preparation plan for the candidate to prepare for the interview"),
});


async function generateInterviewReport({resume, selfDescription, jobDescription}) {

        const prompt = `Generate an interview report for a candidate based on the following information:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config:{
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            },
        });

        return JSON.parse(response.text);

}        

//checking in server.js
export {generateInterviewReport};