import axios from "axios";
import { getCookie } from "./Cookies";
import { automlURL } from "./Constants";

export default function getExperiments() {
  return axios
    .get(`${automlURL}/experiments`, {
      headers: {
        Token: getCookie("authorization"),
        "User-Id": getCookie("userId"),
        "Project-Id": "1",
      },
    })
    .then((response) => response.data);
}
