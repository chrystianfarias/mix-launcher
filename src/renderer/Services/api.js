import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/files",
});

export default api;
