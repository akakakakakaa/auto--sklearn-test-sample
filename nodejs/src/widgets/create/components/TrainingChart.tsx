import React, { useEffect, useState } from "react";
import CompChart from "../../charts/CompChart";
import testDataTrainingChart from "../../charts/CompChartData.json";
import getHistory from "../../../api/getHistory";

export default function TrainingChart(props: { expId: string }) {
  /*const [data, setData] = useState(
    testDataTrainingChart.map((item) => {
      return { id: item.id, color: item.color, data: item.data.slice(0, 1) };
    })
  );*/
  const [data, setData] = useState([
    {
      id: "1",
      color: "hsl(81, 70%, 50%)",
      data: [],
    },
  ]);
  /*useEffect(() => {
    let index = 0;
    const timeout = setInterval(() => {
      if (index - 1 === testDataTrainingChart[0].data.length) return;
      index++;
      setData(
        testDataTrainingChart.map((item) => {
          return {
            id: item.id,
            color: item.color,
            data: item.data.slice(0, index),
          };
        })
      );
    }, 650);
    return () => clearTimeout(timeout);
  }, []);*/

  const loadData = () => {
    getHistory(props.expId).then((response) => {
      setData(
        response.estimator
          .map((model: any) => {
            return {
              id: model.name, //+ new Date(),
              color: "hsl(81, 70%, 50%)",
              data: model.history
                .map((history: any, index2: any) => {
                  return history.metric[0] && "val" in history.metric[0]
                    ? {
                        x: index2,
                        y: history.metric[0].val,
                      }
                    : { x: -1, y: 0 };
                })
                .filter((e: any) => e.x !== -1),
            };
          })
          .filter((e: any) => e.data.length > 1) // && e.id === "random_forest"
      );
    });
  };

  useEffect(() => {
    loadData();
    const timeout = setInterval(loadData, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return <CompChart data={data} />;
}
