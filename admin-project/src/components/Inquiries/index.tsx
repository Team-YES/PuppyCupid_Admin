import clsx from "clsx";
import { InquiryCompStyled } from "./styled";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";

interface TitleProps {
  title: string;
  button?: string;
}

// 신고 정보
const InquiriesComp = ({ title, button }: TitleProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 최초 마운트 시 데이터 불러오기
  // useEffect(() => {
  //   dispatch(getAdminReports());
  // }, [dispatch]);

  // 조회
  // const reportData = useSelector(
  //   (state: RootState) => state.adminReports.reports
  // );

  // console.log("신고정보", reportData);
  // const [info, setInfo] = useState<Report[]>([]);

  // useEffect(() => {
  //   setInfo(reportData); // Redux 데이터 → 로컬 상태 복사
  // }, [reportData]);

  return (
    <InquiryCompStyled className={clsx("Inquiries")}>
      <div className="global_title">{title}</div>
    </InquiryCompStyled>
  );
};

export default InquiriesComp;
