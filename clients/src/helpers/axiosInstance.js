import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chatapp-r106.onrender.com " || "http://localhost:5000",
});

export default axiosInstance;
