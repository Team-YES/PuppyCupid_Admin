import clsx from "clsx";
import { ReportsCompStyled } from "./styled";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { Report, getAdminReports } from "@/reducers/getAdminReports";
import { Cell } from "../UserInfo/styled";
import { formatKoreanDate, formatReportType } from "@/utill/format";
import { Select, Modal, Button } from "antd";
import PaginationWrapper from "@/components/Pagination";

interface TitleProps {
  title: string;
  button?: string;
}

// 유형 필터 옵션 정의
const FILTER_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "게시글 신고", value: "post" },
  { label: "댓글 신고", value: "comment" },
  { label: "유저 신고", value: "user" },
];

// 신고 정보
const ReportsComp = ({ title, button }: TitleProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 최초 마운트 시 데이터 불러오기
  useEffect(() => {
    dispatch(getAdminReports());
  }, [dispatch]);

  // 조회
  const reportData = useSelector(
    (state: RootState) => state.adminReports.reports
  );

  const [info, setInfo] = useState<Report[]>([]);
  const [filterType, setFilterType] = useState<string>("all");

  console.log("신고정보", info);

  // 페이지네이션 계산
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 페이지당 항목 수

  const paginatedData = info.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 필터 적용 및 정렬
  useEffect(() => {
    let filtered = [...reportData];

    if (filterType !== "all") {
      filtered = filtered.filter((r) => r.reportType === filterType);
    }

    // 신고번호 오름차순 정렬
    filtered.sort((a, b) => a.id - b.id);

    setInfo(filtered);
  }, [reportData, filterType]);

  // useEffect(() => {
  //   setInfo(reportData); // Redux 데이터 → 로컬 상태 복사
  // }, [reportData]);

  // 모달 보기
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  // 테이블 헤더
  const headerLabels = [
    "신고대상 ID",
    "닉네임",
    "유형",
    "신고자",
    "사유",
    "신고일",
  ];
  const flexValues = [1, 1, 1, 1, 1.5, 1.5];

  return (
    <ReportsCompStyled className={clsx("Reports")}>
      <div className="Reports_header">
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
      <div className="Reports_table">
        {headerLabels.map((label, i) => (
          <Cell key={i} $flex={flexValues[i]}>
            {label}
          </Cell>
        ))}
      </div>

      {/* 테이블 내용 */}
      {paginatedData.map((data, rowIdx) => (
        <div
          className="Reports_table"
          key={rowIdx}
          onClick={() => {
            handleOpenModal(data);
          }}
        >
          {[
            data.targetInfo.userId,
            data.targetInfo.nickName,
            formatReportType(data.reportType),
            data.reporter.nickName,
            data.reason,
            formatKoreanDate(data.created_at),
          ].map((cell, colIdx) => (
            <Cell key={colIdx} $flex={flexValues[colIdx]}>
              {cell}
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

      {/* 신고내용 보기 모달 */}
      <Modal
        title={`신고 상세 보기 - #${selectedReport?.id}`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" type="primary" onClick={handleCloseModal}>
            닫기
          </Button>,
        ]}
      >
        <p>
          <strong>신고 대상 ID:</strong> {selectedReport?.targetInfo.userId}
        </p>
        <p>
          <strong>신고 대상 닉네임:</strong>{" "}
          {selectedReport?.targetInfo.nickName}
        </p>
        <p>
          <strong>신고 유형:</strong>{" "}
          {formatReportType(selectedReport?.reportType || "")}
        </p>
        <p>
          <strong>신고자:</strong> {selectedReport?.reporter.nickName}
        </p>
        <p>
          <strong>신고일:</strong>{" "}
          {formatKoreanDate(selectedReport?.created_at || "")}
        </p>
        <p>
          <strong>신고 사유:</strong> {selectedReport?.reason}
        </p>

        <hr />

        {/* 조건부 내용 출력 */}
        {selectedReport?.reportType === "post" && (
          <p>
            <strong>게시글 내용:</strong>
            <br />
            {selectedReport?.targetInfo.content || "내용 없음"}
          </p>
        )}
        {selectedReport?.reportType === "comment" && (
          <p>
            <strong>댓글 내용:</strong>
            <br />
            {selectedReport?.targetInfo.content || "내용 없음"}
          </p>
        )}
        {selectedReport?.reportType === "user" && (
          <p style={{ fontStyle: "italic", color: "#888" }}>
            신고 내용이 없습니다.
          </p>
        )}
      </Modal>
    </ReportsCompStyled>
  );
};

export default ReportsComp;
