import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://e-commerce-api-3wara.vercel.app",
});

export default axiosInstance;
