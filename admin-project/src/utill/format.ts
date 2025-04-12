// src/utils/format.ts
import { format } from "date-fns";
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

// 가입일 포맷 (한국 시간 기준)
export const formatKoreanDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  return format(kstDate, "yyyy-MM-dd HH:mm", { locale: ko });
};
