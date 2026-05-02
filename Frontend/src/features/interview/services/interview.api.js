import axios from "axios";

// const API_BASE_URL = 'http://localhost:3125/api/interview'; // Change this to your backend URL

const API_BASE_URL = `${import.meta.env.API_BASE_URL}interview` || 'http://localhost:3125/api/interview';

export const generateInterviewReport = async ({jobDescription,  selfDescription, resumeFile}) => {
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('selfDescription', selfDescription);
    formData.append('resume', resumeFile);

    const response = await axios.post(`${API_BASE_URL}/generate-interview-report`, formData, {
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    }, {
        withCredentials: true
    });
}

export const getInterviewReportById = async (interviewId) => {
    const response = await axios.get(`${API_BASE_URL}/report/${interviewId}`, {
        withCredentials: true
    });
    console.log("getInterviewReportById API response:", response);
    return response.data;
}

export const getAllInterviewReports = async () => {
    let response = null;
    try {
        response = await axios.get(`${API_BASE_URL}/`, {
            withCredentials: true
        });
        console.log("getAllInterviewReports API response:", response);
    }
    catch (err) {
        console.log("Error in getAllInterviewReports API call:", err);
    }

    return response?.data;
}

export const generateResumePdf = async ({interviewReportId}) => {
    const response = await axios.post(`${API_BASE_URL}/resume/pdf/${interviewReportId}`, {}, {
        withCredentials: true,
        responseType: 'blob'
    });

    return response.data;
}