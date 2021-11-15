import axios from "axios";

const api = axios.create({
  baseURL: "https://beta.mixmods.com.br/launcher",
});

export default api;
