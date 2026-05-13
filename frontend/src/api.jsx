import axios from "axios";

const api = axios.create({
  baseURL: "https://dailycode-learning-plateform-4.onrender.com/api",
});

export default api;
