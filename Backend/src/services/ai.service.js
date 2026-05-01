// const { GoogleGenAI } = require("@google/genai");
// require("dotenv").config();
// const { z } = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");

// console.log("GOOGLE_GENAI_API_KEY:", process.env.GOOGLE_GENAI_API_KEY);

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY
// });

// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
//     })).describe("List of skill gaps in the candidate's profile along with their severity"),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
//         tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
//     })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
//     title: z.string().describe("The title of the job for which the interview report is generated"),
// })

// async function invokeGeminiAi() {
//     const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: "Hello, gemini! Explain what is interview ?"
//     });

//     console.log(response.text);
// }

// async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
//     const prompt = `
//         Generate an interview report for a candidate with the following details:
//         Job Description: ${jobDescription}
//         Resume: ${resume}
//         Self Description: ${selfDescription}
//     `;

//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(interviewReportSchema, { target: "openApi3" })
//         }
//     });

//     console.log(JSON.parse(response.text));
// }

// module.exports = { generateInterviewReport };



const { GoogleGenAI, Type } = require("@google/genai");
require("dotenv").config();
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// 1. Define the schema using Gemini's native Type enums
const geminiSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: {
            type: Type.NUMBER,
            description: "A score indicating how well the candidate's resume matches the job description, on a scale of 0 to 100."
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that could be asked in the interview.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical question." },
                    intention: { type: Type.STRING, description: "The intention behind asking it." },
                    answer: { type: Type.STRING, description: "How to answer this question." }
                }
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that could be asked in the interview.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The behavioral question." },
                    intention: { type: Type.STRING, description: "The intention behind asking it." },
                    answer: { type: Type.STRING, description: "How to answer this question." }
                }
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "List of skill gaps based on the resume and job description.",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "Skills the candidate is lacking." },
                    severity: { type: Type.STRING, description: "Severity of the gap (low, medium, high)." }
                }
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A day-wise preparation plan.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER, description: "The day number, starting from 1." },
                    focus: { type: Type.STRING, description: "The main focus for the day." },
                    tasks: {
                        type: Type.ARRAY,
                        description: "List of tasks to be done on this day.",
                        items: { type: Type.STRING }
                    }
                }
            }
        },
        title: {
            type: Type.STRING,
            description: "The title of the job for which the interview report is generated."
        }
    },
    // Optional: force the model to return ALL these keys
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
};

async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
    const prompt = `
        Generate an interview report for a candidate with the following details:
        Job Description: ${jobDescription}
        Resume: ${resume}
        Self Description: ${selfDescription}
        
        IMPORTANT: Return ONLY a valid JSON object adhering strictly to the schema. Do not include markdown formatting.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // 2. Pass the native schema directly
                responseSchema: geminiSchema,
                // Add a slightly lower temperature to make the output more deterministic
                temperature: 0.2
            }
        });

        // 3. Parse the text response into a real JavaScript object
        const jsonResponse = JSON.parse(response.text);
        // console.log("Raw Response: ", response.text);
        // console.log("Structured Response: ", jsonResponse);

        return jsonResponse;

    } catch (error) {
        console.error("Error generating report:", error);
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    // const resumePdfSchema = z.object({
    //     html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    // })

    const resumePdfSchema = {
        type: Type.OBJECT,
        properties: {
            html: { type: Type.STRING, description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer" }
        },
        required: ["html"]
    }

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema,
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf };