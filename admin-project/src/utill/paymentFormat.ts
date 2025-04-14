import { Payment } from "@/reducers/getPayment";
import { format } from "date-fns";

export const getDailyPaymentStats = (payments: Payment[]) => {
  const stats: Record<string, number> = {};

  payments.forEach((payment) => {
    const day = format(new Date(payment.created_at), "MM-dd"); // '04-08' 형식
    stats[day] = (stats[day] || 0) + payment.amount;
  });

  const sortedDays = Object.keys(stats).sort(); // 날짜 순 정렬

  return {
    days: sortedDays,
    totals: sortedDays.map((day) => stats[day]),
  };
};
