import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

const LineChart = ({ historicaldata }) => {
  const [data, setData] = useState([["Date", "Prices"]]);

  useEffect(() => {
    let dataCopy = [["Date", "Prices"]];

    if (historicaldata?.prices) {
      historicaldata.prices.forEach((item) => {
        // Format as day/month (e.g., 25/6)
        const d = new Date(item[0]);
        const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
        dataCopy.push([dateStr, item[1]]);
      });
      setData(dataCopy);
    }
  }, [historicaldata]);

  return (
    <Chart
      chartType="LineChart"
      data={data}
      height="100%"
      legendToggle
    />
  );
};

export default LineChart;