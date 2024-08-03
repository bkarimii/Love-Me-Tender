import axios from "axios";

const getToken = () => localStorage.getItem("authToken");

const client = axios.create({
	baseURL: "/",
	headers: {
		"Content-Type": "application/json",
	},
});

client.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

const handleAuthError = (error) => {
	if (error.response && error.response.status === 401) {
		localStorage.removeItem("authToken");
		localStorage.removeItem("userType");
		window.location.href = "/";
	} else {
		throw error;
	}
};

export const get = async (endpoint) => {
	try {
		const response = await client.get(endpoint);
		return response.data;
	} catch (error) {
		handleAuthError(error);
	}
};

export const post = async (endpoint, data) => {
	try {
		const response = await client.post(endpoint, data);
		return response.data;
	} catch (error) {
		handleAuthError(error);
	}
};

export const put = async (endpoint, data) => {
	try {
		const response = await client.put(endpoint, data);
		return response.data;
	} catch (error) {
		handleAuthError(error);
	}
};

export const del = async (endpoint) => {
	try {
		const response = await client.delete(endpoint);
		return response.data;
	} catch (error) {
		handleAuthError(error);
	}
};
