// const interviewSchema = require('../model/interviewSchema.model.js');
const pdfParse = require('pdf-parse');
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service.js");
const interviewModel = require('../model/interviewSchema.model.js');

const generateInterviewReportController = async (req, res) => {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const { selfDescription, jobDescription } = req.body;
    
    const interviewReportByAi = await generateInterviewReport({ jobDescription, resume: resumeContent.text, selfDescription });

    if (!interviewReportByAi?.title) {
        return res.status(400).json({ message: "AI did not generate a title for the interview report." });
    }

    const interviewReport = await interviewModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        jobDescription,
        selfDescription,
        ...interviewReportByAi
    });

    res.status(201).json({
        message: "Interview report generated successfully",
        report: interviewReport
    });
}

const getInterviewReportByIdController = async (req, res) => {
    const { interviewId } = req.params;
    const interviewReport = await interviewModel.findOne({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found" });
    };

    res.status(200).json({
        message: "Interview report fetched successfully",
        report: interviewReport
    });
}

const getAllInterviewReportsController = async (req, res) => {
    const interviewReports = await interviewModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -jobDescription -selfDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
        message: "All interview reports fetched successfully",
        interviewReports
    });
}

const generateResumePdfController = async (req, res) => {
    const { interviewReportId } = req.params;
    console.log("interviewer.controller generateResumePdfController: ", interviewReportId);

    const interviewReport = await interviewModel.findById(interviewReportId);

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found" });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;
    
    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    res.send(pdfBuffer);
}

module.exports = { generateInterviewReportController, generateResumePdfController, getAllInterviewReportsController, getInterviewReportByIdController };