import { startOfWeek, parseISO, isAfter } from "date-fns";
import { AdminUser } from "@/reducers/getUserInfo";

export const getThisWeekJoinCount = (users: AdminUser[]): number => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 0 }); // 일요일 기준
  return users.filter((user) => {
    const createdAt = parseISO(user.created_at); // 문자열을 Date로 파싱
    return isAfter(createdAt, monday); // 이번 주 월요일 이후
  }).length;
};
