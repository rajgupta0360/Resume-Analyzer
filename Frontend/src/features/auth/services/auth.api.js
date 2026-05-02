import axios from "axios";

// const API_BASE_URL = 'http://localhost:3125/api'; // Change this to your backend URL
const API_BASE_URL = `${import.meta.env.VITE_API_URL}` || 'http://localhost:3125/api';
console.log("API_BASE_URL: ", API_BASE_URL);
export async function registerUser(email, password, username) {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, { email, password, username }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Error in registerUser: ${error}`);
    }
}

export async function loginUser(email, password) {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, {
            withCredentials: true
        });
        return response.data;
    }
    catch (error) {
        console.error(`Error in loginUser: ${error}`);
    }
}

export async function logoutUser() {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/logout`, {withCredentials: true});
        return response.data;
    } catch (error) {
        console.error(`Error in logoutUser: ${error}`);
    }
}

export async function getUserDetails() {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/user`, { withCredentials: true });
        console.log("getUserDetails response: ", response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in getUserDetails: ${error}`);
    }
}