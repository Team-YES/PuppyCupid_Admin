import clsx from "clsx";
import { ReportsCompStyled } from "./styled";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { Report, getAdminReports } from "@/reducers/getAdminReports";
import { Cell } from "../UserInfo/styled";
import { formatGender, formatKoreanDate, formatPhone } from "@/utill/format";
import { Button } from "antd";

interface TitleProps {
  title: string;
  button?: string;
}

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

  useEffect(() => {
    setInfo(reportData); // Redux 데이터 → 로컬 상태 복사
  }, [reportData]);

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
      <div className="global_title">{title}</div>

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
            data.reportType,
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
