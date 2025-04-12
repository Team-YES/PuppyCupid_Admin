import clsx from "clsx";
import { UserInfoStyled, Cell } from "./styled";
import { Button } from "antd";
import { AdminUser, fetchAdminUsers } from "@/reducers/getUserInfo";
import type { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface TitleProps {
  title: string;
  button?: string;
}

// 유저 정보
const UserInfo = ({ title, button }: TitleProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 조회
  const users = useSelector((state: RootState) => state.adminUsers.users);
  const [info, setInfo] = useState<AdminUser[]>([]);

  useEffect(() => {
    setInfo(users); // Redux 데이터 → 로컬 상태 복사
  }, [users]);

  console.log("유저 정보", info);

  // 최초 마운트 시 유저 불러오기
  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  // 테이블 헤더
  const headerLabels = [
    "ID",
    "이름",
    "성별",
    "휴대전화번호",
    "가입일",
    "회원탈퇴",
  ];
  const flexValues = [1, 1, 1, 1.5, 1.5, 1];

  // 시간 변경
  const formatKoreanDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const offsetDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // KST 보정
    return format(offsetDate, "yyyy-MM-dd HH:mm", { locale: ko });
  };

  // 휴대폰 포맷
  const formatPhone = (phone?: string) => {
    if (!phone) return "작성필요";
    return phone.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  };

  return (
    <UserInfoStyled className={clsx("userInfo")}>
      <div className="userInfo_title">
        {title} {button ? <Button>{button}</Button> : <></>}
      </div>

      {/* 테이블 헤더 */}
      <div className="userInfo_table">
        {headerLabels.map((label, i) => (
          <Cell key={i} $flex={flexValues[i]}>
            {label}
          </Cell>
        ))}
      </div>

      {/* 테이블 내용 */}
      {info.map((data, rowIdx) => (
        <div className="userInfo_table" key={rowIdx}>
          {[
            data.id,
            data.name ? data.name : "-",
            data.gender === "male"
              ? "남"
              : data.gender === "female"
              ? "여"
              : "-",
            formatPhone(data.phone),
            formatKoreanDate(data.created_at),
            "회원탈퇴",
          ].map((cell, colIdx) => (
            <Cell key={colIdx} $flex={flexValues[colIdx]}>
              {colIdx === 5 ? <Button>{cell}</Button> : cell}
            </Cell>
          ))}
        </div>
      ))}
    </UserInfoStyled>
  );
};

export default UserInfo;
