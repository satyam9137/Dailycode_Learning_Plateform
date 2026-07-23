import axios from "axios";

const api = axios.create({
  baseURL: "https://dailycode-learning-plateform-2.onrender.com/api",
});

export default api;
