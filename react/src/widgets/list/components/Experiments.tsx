import React, { useEffect, useState } from "react";
import "./Experiments.scss";
import getExperiments from "../../../api/getExperiments";
import getHistory from "../../../api/getHistory";
import TrainingChart from "../../create/components/TrainingChart";
import Animated from "react-mount-animation";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
} from "@material-ui/data-grid";

type Exp = {
  id: string;
  name: string;
  status: string;
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "name", headerName: "실험명", flex: 1 },
  { field: "status", headerName: "상태", flex: 1 },
];

export default function Experiments() {
  const [expList, setExpList] = useState([]);
  const [expId, setExpId] = useState<string | number>(-1);
  useEffect(() => {
    getExperiments().then((data) => setExpList(data.runs));
  }, []);

  if (expList.length === 0) return <></>;
  else {
    return (
      <>
        <Animated.div
          show={expId === -1}
          unmountAnim={` 
          0% {opacity: 1}
          100% {opacity: 0}
      `} /*10% { transform: translate3d(0,20vh,0); }*/
        >
          <div style={{ height: "70vh", width: "80vw", margin: "1rem" }}>
            <DataGrid
              rows={expList}
              columns={columns}
              pageSize={10}
              onRowClick={(param) => setExpId(param.row!.id!)}
            />
          </div>
        </Animated.div>
        <Animated.div
          id="training-chart"
          show={expId !== -1}
          delay={1.4}
          mountAnim={` 
        0% {opacity: 0}
        100% {opacity: 1}
    `}
          style={{ height: "75vh", width: "60vw" }}
        >
          <>
            <TrainingChart expId={expId.toString()} />
          </>
        </Animated.div>
      </>
    );
  }
}
