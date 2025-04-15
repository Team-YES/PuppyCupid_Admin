import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useDispatch, useSelector } from "react-redux";
import { getServiceUsageStats } from "@/reducers/getDailyActivity"; // thunk
import type { UsageStat } from "@/reducers/getDailyActivity"; // 타입
import { RootState, AppDispatch } from "@/store/store"; // RootState와 AppDispatch 타입 가져오기

const DailyActivityChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>(); // AppDispatch 타입 사용

  // RootState 타입을 기반으로 데이터 가져오기
  const { data, loading, error } = useSelector(
    (state: RootState) => state.adminDailyActivity
  );

  useEffect(() => {
    dispatch(getServiceUsageStats()); // 데이터를 가져오는 액션
  }, [dispatch]);

  useEffect(() => {
    if (!chartRef.current || loading || !data) return;

    const chartInstance = echarts.init(chartRef.current);

    // 단일 객체로부터 값을 추출 (배열로 감싸서 차트 데이터로 전달)
    const dates: string[] = [data.date]; // 단일 날짜
    const posts: number[] = [data.postsCount]; // 게시물 수
    const chats: number[] = [data.chatsCount]; // 채팅 수
    const payments: number[] = [data.paymentsCount]; // 결제 수

    const option = {
      title: {
        text: "서비스 이용 패턴 (일자별)", // 차트 제목
        left: "center",
      },
      tooltip: {
        trigger: "axis", // 툴팁 표시
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        top: 30,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category", // x축은 날짜별로 표시
        data: dates, // 단일 날짜 데이터 배열
      },
      yAxis: {
        type: "value", // y축은 숫자 값
      },
      series: [
        {
          name: "게시물", // 첫 번째 시리즈: 게시물
          type: "bar", // 막대 그래프
          stack: "total", // 누적 그래프
          emphasis: { focus: "series" },
          data: posts, // 게시물 수 데이터
        },
        {
          name: "채팅", // 두 번째 시리즈: 채팅
          type: "bar", // 막대 그래프
          stack: "total", // 누적 그래프
          emphasis: { focus: "series" },
          data: chats, // 채팅 수 데이터
        },
        {
          name: "결제", // 세 번째 시리즈: 결제
          type: "bar", // 막대 그래프
          stack: "total", // 누적 그래프
          emphasis: { focus: "series" },
          data: payments, // 결제 수 데이터
        },
      ],
    };

    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose(); // 컴포넌트 언마운트 시 차트 인스턴스를 제거하여 메모리 누수 방지
    };
  }, [data, loading]); // data나 loading이 변경될 때마다 차트 업데이트

  // 로딩 중이나 오류 발생 시 표시
  if (loading) return <p>로딩 중...</p>;
  // if (error) return <p>오류</p>;

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />; // 차트 표시
};

export default DailyActivityChart;
