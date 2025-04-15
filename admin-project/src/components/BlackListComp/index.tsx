import { BlackListStyled } from "./styled";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { BlacklistedUser, getBlacklist } from "@/reducers/getBlackList";
import { Cell } from "../UserInfo/styled";
import PaginationWrapper from "@/components/Pagination";
import { Button } from "antd";
import { formatKoreanDate } from "@/utill/format";

interface TitleProps {
  title: string;
  button?: string;
}

const BlackListComp = ({ title, button }: TitleProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const blackList = useSelector((state: RootState) => state.blacklist.list);

  const [info, setInfo] = useState<BlacklistedUser[]>([]);

  console.log("블랙리스트", info);

  useEffect(() => {
    dispatch(getBlacklist());
  }, [dispatch]);

  useEffect(() => {
    setInfo(blackList); // Redux 데이터 → 로컬 상태 복사
  }, [blackList]);

  // 페이지네이션 계산
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 페이지당 항목 수

  const paginatedData = info.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 테이블 헤더
  const headerLabels = ["번호", "블랙리스트 사유", "추가일", "해제"];
  const flexValues = [1, 1.5, 1, 1];

  return (
    <BlackListStyled>
      {/* 타이틀 */}
      <div className="global_title">{title}</div>

      {/* 테이블 헤더 */}
      <div className="Blacklist_table">
        {headerLabels.map((label, i) => (
          <Cell key={i} $flex={flexValues[i]}>
            {label}
          </Cell>
        ))}
      </div>

      {/* 테이블 내용 */}
      {paginatedData.map((data, rowIdx) => (
        <div className="Blacklist_table" key={rowIdx}>
          {[
            data.id,
            data.reason,
            formatKoreanDate(data.created_at),
            "해제하기",
          ].map((cell, colIdx) => (
            <Cell key={colIdx} $flex={flexValues[colIdx]}>
              {colIdx === 3 ? (
                <Button
                  onClick={() => {
                    console.log(1);
                  }}
                >
                  {cell}
                </Button>
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
    </BlackListStyled>
  );
};

export default BlackListComp;
