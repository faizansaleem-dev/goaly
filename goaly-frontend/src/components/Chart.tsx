import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { getTrendData } from "../api/goal";

const GoalProjectionChart = () => {
  const [chartData, setChartData] = useState([{}]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")?.toString();
      const result = await getTrendData(token as string);
      console.log(result, "<<<<<RESULT");
      setChartData(result.monthlyData);
    };

    fetchData();
  }, []);

  const chartOptions = {
    title: {
      text: "Expense Trend vs Savings Goal",
    },
    xAxis: {
      categories: chartData.map((data) => data.month),
    },
    yAxis: {
      title: {
        text: "Amount ($)",
      },
    },
    series: [
      {
        name: "Required Monthly Saving",
        data: chartData.map((data) => data.requiredMonthlySaving),
        color: "green",
      },
      {
        name: "Average Monthly Spending",
        data: chartData.map((data) => data.averageMonthlySpending),
        color: "red",
      },
      {
        name: "Accumulated Savings",
        data: chartData.map((data) => data.accumulatedSavings),
        color: "blue",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default GoalProjectionChart;
