import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chatapp-r106.onrender.com",
});

export default axiosInstance;
