import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Inquiry } from "@/reducers/getAdminInquiries";
import { formatInquiryType } from "@/utill/format";

interface Props {
  info: Inquiry[];
}

const ExampleChart = ({ info }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 기존 인스턴스가 존재하면 제거
    echarts.dispose(chartRef.current);

    const chartInstance = echarts.init(chartRef.current);

    // 1. 유형별 개수 집계
    const typeCounts: Record<string, number> = {};
    info.forEach((item) => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });

    // 2. ECharts용 데이터 포맷
    const chartData = Object.entries(typeCounts).map(([key, value]) => ({
      name: formatInquiryType(key), // "환불 문의" 등
      value,
    }));

    // 차트 옵션 세팅
    const option = {
      title: {
        text: "문의 유형 통계",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "문의 유형",
          type: "pie",
          radius: "50%",
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    chartInstance.setOption(option);

    // 💡 사이즈 변경 대응
    // const handleResize = () => {
    //   chartInstance.resize();
    // };
    // window.addEventListener("resize", handleResize);

    // return () => {
    //   window.removeEventListener("resize", handleResize);
    //   chartInstance.dispose(); // 정리
    // };
  }, [info]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default ExampleChart;
