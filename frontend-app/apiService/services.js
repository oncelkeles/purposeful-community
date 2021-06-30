import axios from "axios";

export default axios.create({
  // for prod
  //baseURL: "https://produrl",

  // for development
  baseURL: "http://192.168.1.101:3000/api/v1/",
  withCredentials: true,
});