import clsx from "clsx";
import { InquiryCompStyled } from "./styled";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { getAdminInquiries, Inquiry } from "@/reducers/getAdminInquiries";
import { Cell } from "../UserInfo/styled";
import {
  formatInquiryType,
  formatKoreanDate,
  formatPhone,
} from "@/utill/format";
import { Button, Select } from "antd";

interface TitleProps {
  title: string;
  button?: string;
}

// 유형 필터 옵션 정의
const FILTER_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "환불 문의", value: "service" },
  { label: "신고 문의", value: "bug" },
  { label: "기타 문의", value: "etc" },
];

// 신고 정보
const InquiriesComp = ({ title, button }: TitleProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 최초 마운트 시 데이터 불러오기
  useEffect(() => {
    dispatch(getAdminInquiries());
  }, [dispatch]);

  // 조회
  const inquiryData = useSelector(
    (state: RootState) => state.admminInquiries.inquiries
  );

  const [info, setInfo] = useState<Inquiry[]>([]);
  console.log("문의정보", info);
  const [filterType, setFilterType] = useState<string>("all");

  // 필터 적용 및 정렬
  useEffect(() => {
    let filtered = [...inquiryData];

    if (filterType !== "all") {
      filtered = filtered.filter((r) => r.type === filterType);
    }

    // 신고번호 오름차순 정렬
    filtered.sort((a, b) => a.id - b.id);

    setInfo(filtered);
  }, [inquiryData, filterType]);

  // 테이블 헤더
  const headerLabels = [
    "문의번호",
    "유형",
    "문의자",
    "이메일",
    "휴대전화번호",
    "상태",
    "등록일",
    "보기",
  ];
  const flexValues = [1, 1, 1, 1.5, 1.5, 1, 1.5, 1];

  return (
    <InquiryCompStyled className={clsx("Inquiries")}>
      <div className="Inquiries_header">
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
      <div className="Inquiries_table">
        {headerLabels.map((label, i) => (
          <Cell key={i} $flex={flexValues[i]}>
            {label}
          </Cell>
        ))}
      </div>

      {/* 테이블 내용 */}
      {info.map((data, rowIdx) => (
        <div className="Inquiries_table" key={rowIdx}>
          {[
            data.id,
            formatInquiryType(data.type),
            data.name,
            data.user.email,
            formatPhone(data.user.phone),
            data.status,
            formatKoreanDate(data.created_at),
            "보기",
          ].map((cell, colIdx) => (
            <Cell key={colIdx} $flex={flexValues[colIdx]}>
              {colIdx === 7 ? <Button>{cell}</Button> : cell}
            </Cell>
          ))}
        </div>
      ))}
    </InquiryCompStyled>
  );
};

export default InquiriesComp;
