import clsx from "clsx";
import { TitleCompoStyled } from "./styled";
import { Button } from "antd";
import ExampleChart from "@/components/InquiryChart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getAdminInquiries, Inquiry } from "@/reducers/getAdminInquiries";
import { useEffect, useState } from "react";
import { AdminUser, fetchAdminUsers } from "@/reducers/getUserInfo";
import { getThisWeekJoinCount } from "@/utill/getThisWeekJoin";

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
  }, [dispatch]);

  // 조회
  const inquiryData = useSelector(
    (state: RootState) => state.adminInquiries.inquiries
  ); // 문의 정보
  const users = useSelector((state: RootState) => state.adminUsers.users); // 유저 정보

  // 데이터 저장
  const [info, setInfo] = useState<Inquiry[]>([]);
  const [userInfo, setUserInfo] = useState<AdminUser[]>([]);

  console.log("대시보드 문의정보", info);
  console.log("대시보드 유저정보", userInfo);

  // 이번주 가입자 수
  const thisWeekJoinCount = getThisWeekJoinCount(userInfo);
  console.log("이번주 가입자수", thisWeekJoinCount);

  useEffect(() => {
    setInfo(inquiryData); // 문의 정보
    setUserInfo(users); // 유저 정보
  }, [inquiryData, users]);

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
      </div>
    </TitleCompoStyled>
  );
};

export default TitleCompo;
