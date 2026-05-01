const express = require("express");
const {authUser} = require("../middleware/auth.middleware");
const upload = require("../middleware/file.middleware");
const { generateInterviewReportController, getAllInterviewReportsController, generateResumePdfController, getInterviewReportByIdController } = require("../controller/interviewer.controller.js");

const interviewRouter = express.Router();

interviewRouter.post('/generate-interview-report', authUser, upload.single('resume'), generateInterviewReportController);

interviewRouter.get('/report/:interviewId', authUser, getInterviewReportByIdController)

interviewRouter.get('/', authUser, getAllInterviewReportsController);

interviewRouter.post("/resume/pdf/:interviewReportId", authUser, generateResumePdfController);

module.exports = interviewRouter;