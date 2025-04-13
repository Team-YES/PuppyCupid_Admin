import clsx from "clsx";
import { ReportsCompStyled } from "./styled";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { Report, getAdminReports } from "@/reducers/getAdminReports";
import { Cell } from "../UserInfo/styled";
import { formatKoreanDate, formatReportType } from "@/utill/format";
import { Select } from "antd";

interface TitleProps {
  title: string;
  button?: string;
}

// 유형 필터 옵션 정의
const FILTER_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "게시글 신고", value: "post" },
  { label: "댓글 신고", value: "comment" },
  { label: "유저 신고", value: "user" },
];

// 신고 정보
const ReportsComp = ({ title, button }: TitleProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 최초 마운트 시 데이터 불러오기
  useEffect(() => {
    dispatch(getAdminReports());
  }, [dispatch]);

  // 조회
  const reportData = useSelector(
    (state: RootState) => state.adminReports.reports
  );

  const [info, setInfo] = useState<Report[]>([]);
  console.log("신고정보", info);
  const [filterType, setFilterType] = useState<string>("all");

  // 필터 적용 및 정렬
  useEffect(() => {
    let filtered = [...reportData];

    if (filterType !== "all") {
      filtered = filtered.filter((r) => r.reportType === filterType);
    }

    // 신고번호 오름차순 정렬
    filtered.sort((a, b) => a.id - b.id);

    setInfo(filtered);
  }, [reportData, filterType]);

  // useEffect(() => {
  //   setInfo(reportData); // Redux 데이터 → 로컬 상태 복사
  // }, [reportData]);

  // 테이블 헤더
  const headerLabels = [
    "신고번호",
    "유형",
    "신고대상 ID",
    "신고자",
    "이메일",
    "사유",
    "신고일",
  ];
  const flexValues = [1, 1, 1, 1, 1.5, 1.5, 1.5];

  return (
    <ReportsCompStyled className={clsx("Reports")}>
      <div className="Reports_header">
        {/* 타이틀 */}
        <div className="global_title">{title}</div>

        {/* 유형 선택 */}
        <Select
          style={{ width: 150, marginLeft: "auto" }}
          options={FILTER_OPTIONS}
          value={filterType}
          onChange={(value) => setFilterType(value)}
        />
      </div>

      {/* 테이블 헤더 */}
      <div className="Reports_table">
        {headerLabels.map((label, i) => (
          <Cell key={i} $flex={flexValues[i]}>
            {label}
          </Cell>
        ))}
      </div>

      {/* 테이블 내용 */}
      {info.map((data, rowIdx) => (
        <div className="Reports_table" key={rowIdx}>
          {[
            data.id,
            formatReportType(data.reportType),
            data.targetId,
            data.reporter.nickName,
            data.reporter.email,
            data.reason,
            formatKoreanDate(data.created_at),
          ].map((cell, colIdx) => (
            <Cell key={colIdx} $flex={flexValues[colIdx]}>
              {cell}
            </Cell>
          ))}
        </div>
      ))}
    </ReportsCompStyled>
  );
};

export default ReportsComp;
