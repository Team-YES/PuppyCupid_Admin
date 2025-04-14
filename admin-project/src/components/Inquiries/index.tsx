import clsx from "clsx";
import { InquiryCompStyled } from "./styled";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import {
  getAdminInquiries,
  Inquiry,
  deleteAdminInquiry,
  patchInquiryStatus,
} from "@/reducers/getAdminInquiries";
import { Cell } from "../UserInfo/styled";
import {
  formatInquiryType,
  formatKoreanDate,
  formatPhone,
  formatReportType,
  formatStatus,
} from "@/utill/format";
import { Button, Modal, Select, message } from "antd";
import { showConfirmModal } from "@/lib/confirmModal";
import PaginationWrapper from "@/components/Pagination";

interface TitleProps {
  title: string;
  button?: string;
}

// 유형 필터 옵션 정의
const FILTER_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "환불 문의", value: "service" },
  { label: "신고 문의", value: "bug" },
  { label: "기타 문의", value: "etc" },
];

// 신고 정보
const InquiriesComp = ({ title, button }: TitleProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 최초 마운트 시 데이터 불러오기
  useEffect(() => {
    dispatch(getAdminInquiries());
  }, [dispatch]);

  // 조회
  const inquiryData = useSelector(
    (state: RootState) => state.adminInquiries.inquiries
  );

  // 데이터 저장
  const [info, setInfo] = useState<Inquiry[]>([]);
  const [filterType, setFilterType] = useState<string>("all");

  console.log("문의정보", info);

  // 문의 정보 및 모달 상태
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
  };

  // 문의 삭제
  const handleDeleteInquiry = async (id: number) => {
    showConfirmModal({
      title: "문의 삭제",
      content: "해당 문의를 정말 삭제하시겠습니까?",
      okText: "삭제",
      okType: "danger",
      onOk: async () => {
        try {
          await dispatch(deleteAdminInquiry(id)).unwrap();

          await dispatch(getAdminInquiries()); // 데이터 최신화
          message.success("문의가 성공적으로 삭제되었습니다.");
        } catch (error) {
          message.error("문의 삭제 중 오류가 발생했습니다.");
          console.error("삭제 실패:", error);
        }
      },
    });
  };

  // 문의 상태 업데이트
  const handleMarkAsResolved = async () => {
    if (!selectedInquiry) return;

    showConfirmModal({
      title: "문의 상태 변경",
      content: "해당 문의를 '완료' 상태로 변경하시겠습니까?",
      okText: "변경",
      okType: "primary",
      onOk: async () => {
        try {
          await dispatch(
            patchInquiryStatus({ id: selectedInquiry.id, status: "resolved" })
          ).unwrap();

          await dispatch(getAdminInquiries()); // 데이터 최신화
          message.success("문의 상태가 '완료'로 변경되었습니다.");
          handleCloseModal();
        } catch (error) {
          message.error("문의 상태 변경 중 오류가 발생했습니다.");
          console.error("상태 변경 실패:", error);
        }
      },
    });
  };

  // 필터 적용 및 정렬
  useEffect(() => {
    let filtered = [...inquiryData];

    if (filterType !== "all") {
      filtered = filtered.filter((r) => r.type === filterType);
    }

    // 문의번호 오름차순 정렬
    filtered.sort((a, b) => a.id - b.id);

    setInfo(filtered);
  }, [inquiryData, filterType]);

  // 페이지네이션 계산
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 페이지당 항목 수

  const paginatedData = info.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 테이블 헤더
  const headerLabels = [
    "문의번호",
    "유형",
    "문의자",
    "이메일",
    "휴대전화번호",
    "상태",
    "등록일",
    "보기",
    "삭제",
  ];
  const flexValues = [1, 1, 1, 1.5, 1.5, 1, 1.5, 1, 1];

  return (
    <InquiryCompStyled className={clsx("Inquiries")}>
      <div className="Inquiries_header">
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
      <div className="Inquiries_table">
        {headerLabels.map((label, i) => (
          <Cell key={i} $flex={flexValues[i]}>
            {label}
          </Cell>
        ))}
      </div>

      {/* 테이블 내용 */}
      {paginatedData.map((data, rowIdx) => (
        <div className="Inquiries_table" key={rowIdx}>
          {[
            data.id,
            formatInquiryType(data.type),
            data.name,
            data?.user?.email,
            formatPhone(data.user?.phone),
            formatStatus(data.status),
            formatKoreanDate(data.created_at),
            "보기",
            "삭제",
          ].map((cell, colIdx) => (
            <Cell key={colIdx} $flex={flexValues[colIdx]}>
              {colIdx === 7 ? (
                <Button onClick={() => handleOpenModal(data)}>{cell}</Button>
              ) : colIdx === 8 ? (
                <Button danger onClick={() => handleDeleteInquiry(data.id)}>
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

      {/* '보기' 모달 */}
      <Modal
        title={`문의 상세 보기 - #${selectedInquiry?.id}`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="markResolved"
            type="primary"
            onClick={handleMarkAsResolved}
            disabled={selectedInquiry?.status === "resolved"}
          >
            '완료' 상태로 변경
          </Button>,
          <Button key="close" type="default" onClick={handleCloseModal}>
            닫기
          </Button>,
        ]}
      >
        <p>
          <strong>문의자:</strong> {selectedInquiry?.name}
        </p>
        <p>
          <strong>이메일:</strong> {selectedInquiry?.email}
        </p>
        <p>
          <strong>문의유형:</strong>{" "}
          {formatInquiryType(selectedInquiry?.type || "")}
        </p>
        <p>
          <strong>문의일:</strong>{" "}
          {formatKoreanDate(selectedInquiry?.created_at || "")}
        </p>
        <hr />
        <p style={{ whiteSpace: "pre-wrap" }}>{selectedInquiry?.content}</p>
      </Modal>
    </InquiryCompStyled>
  );
};

export default InquiriesComp;
