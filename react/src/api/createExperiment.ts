import axios from "axios";
import { backendURL, taskType } from "./config";

export default async function createExperiment(
  task: taskType,
  name: string,
  training_time: number,
  memory_limit: number,
  metric: string,
  target_column: string,
  file: File
) {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("training_time", training_time.toString());
  formdata.append("memory_limit", memory_limit.toString());
  formdata.append("metric", metric);
  formdata.append("target_column", target_column);
  formdata.append("file", file);

  const response = await axios.post(
    decodeURI(`${backendURL}/autosklearn/${task}`),
    formdata,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}
