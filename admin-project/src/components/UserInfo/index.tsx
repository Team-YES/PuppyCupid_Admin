import clsx from "clsx";
import { UserInfoStyled, Cell } from "./styled";
import { Button, Modal, message } from "antd";
import {
  AdminUser,
  fetchAdminUsers,
  deleteAdminUser,
} from "@/reducers/getUserInfo";
import type { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { formatGender, formatPhone, formatKoreanDate } from "@/utill/format";
import { showConfirmModal } from "@/lib/confirmModal";
import PaginationWrapper from "@/components/Pagination";

interface TitleProps {
  title: string;
  button?: string;
}

// 유저 정보
const UserInfo = ({ title, button }: TitleProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 최초 마운트 시 유저 불러오기
  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  // 조회
  const users = useSelector((state: RootState) => state.adminUsers.users);
  const [info, setInfo] = useState<AdminUser[]>([]);

  useEffect(() => {
    setInfo(users); // Redux 데이터 → 로컬 상태 복사
  }, [users]);

  // console.log("유저 정보", info);

  // 페이지네이션 계산
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 페이지당 항목 수

  const paginatedData = info.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 테이블 헤더
  const headerLabels = [
    "ID",
    "이름",
    "닉네임",
    "성별",
    "이메일",
    "휴대전화번호",
    "가입일",
    "회원탈퇴",
  ];
  const flexValues = [1, 1, 1, 1, 1.5, 1.5, 1.5, 1];

  // 유저 삭제  9855f3
  const handleDelete = (userId: number) => {
    showConfirmModal({
      title: "회원 삭제",
      content: "정말로 해당 회원을 삭제하시겠습니까?",
      okText: "삭제",
      okType: "danger",
      onOk: async () => {
        await dispatch(deleteAdminUser(userId)).unwrap();
        await dispatch(fetchAdminUsers());
        message.success("회원이 성공적으로 삭제되었습니다.");
      },
    });
  };

  return (
    <UserInfoStyled className={clsx("userInfo")}>
      <div className="global_title">
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
      {paginatedData.map((data, rowIdx) => (
        <div className="userInfo_table" key={rowIdx}>
          {[
            data.id,
            data.name ? data.name : "-",
            data.nickName,
            formatGender(data.gender),
            data.email,
            formatPhone(data.phone),
            formatKoreanDate(data.created_at),
            "회원탈퇴",
          ].map((cell, colIdx) => (
            <Cell key={colIdx} $flex={flexValues[colIdx]}>
              {colIdx === 7 ? (
                data.nickName === "관리자" ? (
                  <span style={{ color: "#9855f3", fontWeight: 700 }}>
                    관리자<i className="fa-solid fa-crown"></i>
                  </span>
                ) : (
                  <Button onClick={() => handleDelete(data.id)}>{cell}</Button>
                )
              ) : (
                cell
              )}
            </Cell>
          ))}
        </div>
      ))}

      {/* 페이지네이션 */}
      <PaginationWrapper
        currentPage={currentPage}
        total={info.length}
        onChange={setCurrentPage}
      />
    </UserInfoStyled>
  );
};

export default UserInfo;
