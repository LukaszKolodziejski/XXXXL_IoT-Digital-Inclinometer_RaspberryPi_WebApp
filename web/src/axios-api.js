import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.1.131:8080",
});

export default instance;
