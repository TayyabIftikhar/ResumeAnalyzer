import {GoogleGenAI} from "@google/genai";
import {z} from "zod";
import {zodToJsonSchema} from "zod-to-json-schema";
import puppeteer from "puppeteer";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

console.log(
    "API key loaded:",
    process.env.GOOGLE_GENAI_API_KEY ? "YES" : "NO"
);

// structurd output schema using zod different from mongodb scheme
// const interviewReportSchema = z.object({
//     matchScore: z.number().min(0).max(100).describe("Match score range of 0 to 100, indicating how well the candidate's profile matches the job description"),

//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("Technical questions that can be asked in the interview"),
//         intention: z.string().describe("Intention of interviewer behind the question"),
//         answer: z.string().describe("How to answer the question,what points to cover in the answer"),
//     })).describe("Technical questions that can be asked in the interview"),
    
//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("Behavioral questions that can be asked in the interview"),
//         intention: z.string().describe("Intention of interviewer behind the question"),
//         answer: z.string().describe("How to answer the question,what points to cover in the answer"),
//     })).describe("Behavioral questions that can be asked in the interview"),
    
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("Skill that the candidate is lacking"),
//         severity: z.enum(["low", "medium", "high"]).describe("Severity of the skill gap"),
//     })).describe("Skill gaps that the candidate has"),

//     preparationPlan: z.array(z.object({
//         day: z.number().describe("Day number of the preparation plan"),
//         focus: z.string().describe("Focus area for the day"),
//         tasks: z.array(z.string()).describe("Tasks to be completed on the day"),
//     })).describe("Preparation plan for the candidate to prepare for the interview"),

//     title: z.string().describe("Title of the job for which interview report"),

// });


// async function generateInterviewReport({resume, selfDescription, jobDescription}) {

//         const prompt = `Generate an interview report for a candidate based on the following information:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}`;

//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: prompt,
//             config:{
//                 responseMimeType: "application/json",
//                 responseSchema: zodToJsonSchema(interviewReportSchema),
//             },
//         });

//         return JSON.parse(response.text);

// } 

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"]),
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string()),
        })
    ),

    title: z.string(),
});


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
Generate an interview preparation report for the candidate.

You MUST return the data in exactly this structure:

{
    "title": "job title",
    "matchScore": 0,
    "technicalQuestions": [
        {
            "question": "technical interview question",
            "intention": "what the interviewer wants to evaluate",
            "answer": "how the candidate should answer"
        }
    ],
    "behavioralQuestions": [
        {
            "question": "behavioral interview question",
            "intention": "what the interviewer wants to evaluate",
            "answer": "how the candidate should answer"
        }
    ],
    "skillGaps": [
        {
            "skill": "skill that needs improvement",
            "severity": "low"
        }
    ],
    "preparationPlan": [
        {
            "day": 1,
            "focus": "focus area",
            "tasks": [
                "task 1",
                "task 2"
            ]
        }
    ]
}

Important:
- technicalQuestions MUST be an array of objects.
- behavioralQuestions MUST be an array of objects.
- skillGaps MUST be an array of objects.
- preparationPlan MUST be an array of objects.
- tasks MUST be an array of strings.
- matchScore MUST be a number from 0 to 100.
- severity MUST be exactly "low", "medium", or "high".
- title MUST contain the job title from the Job Description.
- Return ONLY these fields.
- Do NOT return candidate information, strengths, recommendations, notes, or any other fields.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",

            responseJsonSchema: {
                type: "object",

                properties: {
                    title: {
                        type: "string",
                    },

                    matchScore: {
                        type: "number",
                        minimum: 0,
                        maximum: 100,
                    },

                    technicalQuestions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                question: {
                                    type: "string",
                                },
                                intention: {
                                    type: "string",
                                },
                                answer: {
                                    type: "string",
                                },
                            },
                            required: [
                                "question",
                                "intention",
                                "answer",
                            ],
                        },
                    },

                    behavioralQuestions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                question: {
                                    type: "string",
                                },
                                intention: {
                                    type: "string",
                                },
                                answer: {
                                    type: "string",
                                },
                            },
                            required: [
                                "question",
                                "intention",
                                "answer",
                            ],
                        },
                    },

                    skillGaps: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                skill: {
                                    type: "string",
                                },
                                severity: {
                                    type: "string",
                                    enum: ["low", "medium", "high"],
                                },
                            },
                            required: [
                                "skill",
                                "severity",
                            ],
                        },
                    },

                    preparationPlan: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                day: {
                                    type: "number",
                                },
                                focus: {
                                    type: "string",
                                },
                                tasks: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                },
                            },
                            required: [
                                "day",
                                "focus",
                                "tasks",
                            ],
                        },
                    },
                },

                required: [
                    "title",
                    "matchScore",
                    "technicalQuestions",
                    "behavioralQuestions",
                    "skillGaps",
                    "preparationPlan",
                ],
            },
        },
    });

    const parsedResponse = JSON.parse(response.text);

    // Verify the response matches our expected structure
    const validatedResponse = interviewReportSchema.parse(parsedResponse);

    return validatedResponse;
}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent,{ waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({ format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
    await browser.close();
    return pdfBuffer;
}


async function generateResumePdf({resume,selfDescription,jobDescription}) {
    const resumepdfSchema = z.object({
        html: z.string().describe("HTML content of the resume which can be converted to PDF using any library like puppeteer"),
    })

    const prompt = `Generate a resume in HTML format for a candidate based on the following information:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}
                    
                    the response should be in JSON object with a single key "html" which contains the HTML content of the resume.
                    The resume should be well formatted and should contain the following sections:
                    The content of resume should be not sound like its generated by AI, it should be human like and should be unique and should not contain any generic content. The resume should be in HTML format and should be well structured with proper headings and subheadings. 
                    You can highlight the content using some colots or different font styles but overall style should be simple and professional 
                    The content should be ATS friendly and should be optimized for ATS systems so that it can be easily parsed by ATS systems. 
                    The resume should be not be so lengthy and should be concise and only 1 to 2 pages long when converted to pdf and to the point. 
                    
                    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config:{
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumepdfSchema),
        },
    });

    const jsonContent = JSON.parse(response.text);

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;

}




//checking in server.js
export {generateInterviewReport, 
        generateResumePdf};