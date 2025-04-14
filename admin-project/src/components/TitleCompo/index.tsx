import clsx from "clsx";
import { TitleCompoStyled } from "./styled";
import { Button } from "antd";
import ExampleChart from "@/components/InquiryChart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getAdminInquiries, Inquiry } from "@/reducers/getAdminInquiries";
import { AdminUser, fetchAdminUsers } from "@/reducers/getUserInfo";
import { getAdminPayments, Payment } from "@/reducers/getPayment";
import { useEffect, useState } from "react";
import { getThisWeekJoinCount } from "@/utill/getThisWeekJoin";
import DailyPaymentChart from "@/components/PaymentChart";

interface TitleProps {
  title: string;
  button?: string;
}

// 대시보드
const TitleCompo = ({ title, button }: TitleProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 최초 마운트 시 데이터 불러오기
  useEffect(() => {
    dispatch(getAdminInquiries()); // 문의 정보
    dispatch(fetchAdminUsers()); // 유저 정보
    dispatch(getAdminPayments()); // 결제 정보
  }, [dispatch]);

  // 조회
  const inquiryData = useSelector(
    (state: RootState) => state.adminInquiries.inquiries
  ); // 문의 정보
  const users = useSelector((state: RootState) => state.adminUsers.users); // 유저 정보
  const payData = useSelector(
    (state: RootState) => state.adminPayment.payments
  );

  // 데이터 저장
  const [info, setInfo] = useState<Inquiry[]>([]);
  const [userInfo, setUserInfo] = useState<AdminUser[]>([]);
  const [payInfo, setPayInfo] = useState<Payment[]>([]);

  console.log("대시보드 문의정보", info);
  console.log("대시보드 유저정보", userInfo);
  console.log("대시보드 결제정보", payInfo);

  // 이번주 가입자 수
  const thisWeekJoinCount = getThisWeekJoinCount(userInfo);
  // console.log("이번주 가입자수", thisWeekJoinCount);

  useEffect(() => {
    setInfo(inquiryData); // 문의 정보
    setUserInfo(users); // 유저 정보
    setPayInfo(payData); // 결제 정보
  }, [inquiryData, users, payData]);

  return (
    <TitleCompoStyled className={clsx("title-compo")}>
      {/* 타이틀 */}
      <div className="global_title">
        {title} {button ? <Button>{button}</Button> : <></>}
      </div>

      <div className="Dashboard_Wrap">
        {/* 회원 수 관련 */}
        <div>
          <div>
            <i className="fa-regular fa-circle-check"></i> 이번주 가입자 수:{" "}
            <span>{thisWeekJoinCount}명</span>
          </div>
          <div>총게시물 수</div>
        </div>

        {/* 문의 차트 */}
        <div style={{ width: 400 }}>
          <ExampleChart info={info} />
        </div>

        {/* 결제 차트 */}
        <div style={{ width: 450 }}>
          <DailyPaymentChart payments={payInfo} />
        </div>
      </div>
    </TitleCompoStyled>
  );
};

export default TitleCompo;
