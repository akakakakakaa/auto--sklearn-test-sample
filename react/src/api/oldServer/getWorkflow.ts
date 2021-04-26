import axios from "axios";
import { getCookie } from "./Cookies";
import { automlURL } from "./Constants";

export default function getWorkflow(
  taskType: string,
  expId: number,
  workflowId: number
) {
  return axios
    .get(
      `${automlURL}/${taskType}/workflow?experiment_id=${expId}&workflow_id=${workflowId}`,
      {
        headers: {
          Token: getCookie("authorization"),
          "User-Id": getCookie("userId"),
          "Project-Id": "1",
        },
      }
    )
    .then((response) => response.data);
}
