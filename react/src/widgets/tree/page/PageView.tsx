import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { treeClickState } from "../treeClickState";
import ChordPage from "./ChordPage";
import { TrainingChart } from "@/widgets/charts";

type ModelInfo = {
  algorithm: string;
  created_on: string;
  distinct_val_count: number;
  do_id: number;
  do_name: string;
  finished_time: string;
  id: string;
  metric: string;
  name: string;
  status: string;
  target_column: string;
  task_type: string;
};

type VisInfo = {
  metric: string;
  metric_value: string;
  visualization_results: VisResult[];
};

type VisResult = {
  csv_string: string;
  type: string;
  finished_time: string;
};

export default function PageView(props: { selected: treeClickState }) {
  const { expId, modelId, type, view } = props.selected;
  const [modelInfo, setModelInfo] = useState<ModelInfo>();
  const [visInfo, setVisInfo] = useState<VisInfo>();
  const [chosenView, setChosenView] = useState<JSX.Element>();

  const testView = (
    <Typography variant="h3">{`expId: ${expId}, modelId: ${modelId}, type: ${type}, view: ${view}`}</Typography>
  );
  const testConditionalView = (
    <Typography variant="h3">{`visInfo: ${visInfo}, expId: ${expId}, modelId: ${modelId}, type: ${type}, view: ${view}`}</Typography>
  );

  useEffect(() => {
    //if (expId !== undefined && modelId !== undefined && type !== undefined) {
    //  getSummary(type, expId, modelId).then((summary) => setModelInfo(summary));
    //  getVis(type, expId, modelId).then((vis) => setVisInfo(vis));
    //}
    if (view === "mllab") setChosenView(testView);
    else if (view === "experiment") setChosenView(testView);
    else if (view === "version") setChosenView(testView);
    else if (view === "confusionmatrix")
      visInfo && visInfo.visualization_results
        ? setChosenView(testConditionalView)
        : setChosenView(testView);
    else if (view === "chord") setChosenView(<ChordPage />);
    else if (view === "featureimportance")
      visInfo && visInfo.visualization_results
        ? setChosenView(testConditionalView)
        : setChosenView(testView);
    else if (view === "serving") setChosenView(testView);
    else if (view === "learningcurve")
      setChosenView(<TrainingChart expId={"140239906731776"} />);
    else setChosenView(<></>);
  }, [props.selected]);

  return (
    <div
      style={{
        float: "right",
        width: "75vw",
        height: "calc(100vh - 200px)",
        color: "#e0e0e0",
        position: "relative",
      }}
    >
      {chosenView}
    </div>
  );
}
