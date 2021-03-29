import axios from "axios";
import { backendURL } from "./config";

export default function getHistory(id: number | string) {
  return axios
    .get(`${backendURL}/autosklearn/${id}/history`)
    .then((response) => response.data);
}
