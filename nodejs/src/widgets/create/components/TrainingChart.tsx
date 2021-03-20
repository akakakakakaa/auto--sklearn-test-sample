import React, { useEffect, useState } from "react";
import CompChart from "../../charts/CompChart";
import testDataTrainingChart from "../../charts/CompChartData.json";

export default function TrainingChart() {
  const [data, setData] = useState(
    testDataTrainingChart.map((item) => {
      return { id: item.id, color: item.color, data: item.data.slice(0, 1) };
    })
  );

  useEffect(() => {
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
  }, []);

  return <CompChart data={data} />;
}
