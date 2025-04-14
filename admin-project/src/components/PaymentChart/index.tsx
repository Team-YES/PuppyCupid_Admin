import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Payment } from "@/reducers/getPayment";
import { getDailyPaymentStats } from "@/utill/paymentFormat";

interface Props {
  payments: Payment[];
}

const DailyPaymentChart = ({ payments }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chartInstance = echarts.init(chartRef.current);
    const { days, totals } = getDailyPaymentStats(payments);

    const option = {
      title: {
        text: "일별 결제 금액 통계",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: days,
      },
      yAxis: {
        type: "value",
        name: "금액 (₩)",
      },
      legend: {
        data: ["금액 (막대)", "금액 (선)"],
        bottom: 0,
      },
      series: [
        {
          name: "금액 (막대)",
          type: "bar",
          data: totals,
          barWidth: "40%",
          itemStyle: {
            color: "#ffe168",
          },
        },
        {
          name: "금액 (선)",
          type: "line",
          data: totals,
          smooth: true,
          itemStyle: {
            color: "#eb57ff",
          },
        },
      ],
    };

    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, [payments]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default DailyPaymentChart;
