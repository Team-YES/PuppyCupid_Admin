// src/utils/format.ts
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { ko } from "date-fns/locale";

// 성별 포맷
export const formatGender = (gender?: string): string => {
  if (gender === "male") return "남";
  if (gender === "female") return "여";
  return "-";
};

// 휴대전화번호 포맷
export const formatPhone = (phone?: string): string => {
  if (!phone) return "작성필요";
  return phone.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
};

// 연/월/일/시간 포맷 (한국 시간 기준)
export const formatKoreanDate = (dateStr: string): string => {
  if (!dateStr) return "-";

  const timeZone = "Asia/Seoul";
  const date = new Date(dateStr);
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy-MM-dd HH:mm", { locale: ko });
};

// 신고유형 포맷
export const formatReportType = (type: string) => {
  switch (type) {
    case "post":
      return "게시글 신고";
    case "comment":
      return "댓글 신고";
    case "user":
      return "유저 신고";
    default:
      return "기타";
  }
};

// 문의유형 포맷
export const formatInquiryType = (type: string) => {
  switch (type) {
    case "service":
      return "환불 문의";
    case "bug":
      return "신고 문의";
    default:
      return "기타 문의";
  }
};

export const formatStatus = (type: string) => {
  switch (type) {
    case "pending":
      return "진행중";
    case "resolved":
      return "완료";
    default:
      return type;
  }
};
