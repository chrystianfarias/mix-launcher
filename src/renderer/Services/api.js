import axios from "axios";

const api = axios.create({
  baseURL: "https://raw.githubusercontent.com/chrystianfarias/mpm/main",
});

export default api;
