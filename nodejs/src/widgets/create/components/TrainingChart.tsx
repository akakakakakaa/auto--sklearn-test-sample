import React, { useEffect, useState } from "react";
import CompChart from "../../charts/CompChart";

export default function TrainingChart() {
  const [data, setData] = useState([
    {
      id: "1",
      color: "hsl(81, 70%, 50%)",
      data: [{ x: 0, y: 0 }],
    },
  ]);

  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    var timeout: NodeJS.Timeout;
    fetch("http://localhost:5500/autosklearntest", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((response) => {
        let thread_id = response.thread_id;
        timeout = setInterval(() => {
          fetch("http://localhost:5500/autosklearntest?thread_id=" + thread_id)
            .then((response) => response.json())
            .then((response) => {
              console.log(response);
              setData(
                Object.keys(response)
                  .map((algorithm, index) => {
                    return {
                      id: algorithm,
                      color: "hsl(81, 70%, 50%)",
                      data: Object.keys(response[algorithm])
                        .map((id, index2) => {
                          return "accuracy" in response[algorithm][id].metrics
                            ? {
                                x: index2,
                                y: response[algorithm][id].metrics.accuracy,
                              }
                            : { x: -1, y: 0 };
                        })
                        .filter((e) => e.x !== -1),
                    };
                  })
                  .filter((e) => e.data.length > 1)
              );
              console.log(response);
            });
        }, 5000);
      });

    return () => clearTimeout(timeout);
  }, []);

  return <CompChart data={data} />;
}
