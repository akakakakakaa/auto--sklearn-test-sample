import axios from "axios";
import { backendURL } from "./config";

export default function getExperiments() {
  return axios
    .get(`${backendURL}/autosklearn/experiments`)
    .then((response) => response.data);
}
