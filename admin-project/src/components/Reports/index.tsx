import clsx from "clsx";
import { ReportsCompStyled } from "./styled";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { Report, getAdminReports } from "@/reducers/getAdminReports";
import { addBlacklistUser, getBlacklist } from "@/reducers/getBlackList";
import { Cell } from "../UserInfo/styled";
import { formatKoreanDate, formatReportType } from "@/utill/format";
import { Select, Modal, Button, Input, message } from "antd";
import PaginationWrapper from "@/components/Pagination";
import { deletePostByAdmin } from "@/reducers/deletePost";
import { deleteCommentByAdmin } from "@/reducers/deleteComment";

const { confirm } = Modal;

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
    dispatch(getBlacklist());
  }, [dispatch]);

  // 조회
  const reportData = useSelector(
    (state: RootState) => state.adminReports.reports
  );

  const [info, setInfo] = useState<Report[]>([]);
  const [filterType, setFilterType] = useState<string>("all");

  // console.log("신고정보", info);

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

  // 신고 상세 모달 보기
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

  // 블랙리스트 모달
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState("");

  // 블랙리스트 조회
  const blackList = useSelector((state: RootState) => state.blacklist.list);

  // console.log("blackList", blackList);

  const handleAddToBlacklist = async () => {
    // 사유가 비어있을때
    if (!selectedReport?.targetInfo.userId || !blacklistReason.trim()) {
      message.warning("사유를 입력해주세요.");
      return;
    }
    // 중복 아이디 체크
    const isAlreadyBlacklisted = blackList.some((user) => {
      return user.targetUserId === selectedReport?.targetInfo.userId;
    });

    if (isAlreadyBlacklisted) {
      message.warning("이미 블랙리스트에 등록된 사용자입니다.");
      return;
    }

    try {
      await dispatch(
        addBlacklistUser({
          userId: selectedReport.targetInfo.userId,
          reason: blacklistReason,
        })
      ).unwrap();

      message.success("블랙리스트에 추가되었습니다.");
      setIsBlacklistModalOpen(false);
      setIsModalOpen(false);
      setBlacklistReason("");
    } catch (err) {
      message.error("추가에 실패했습니다.");
      console.error(err);
    }
  };

  // 테이블 헤더
  const headerLabels = [
    "번호",
    "신고대상 ID",
    "닉네임",
    "유형",
    "신고자",
    "사유",
    "신고일",
  ];
  const flexValues = [1, 1, 1, 1, 1, 1.5, 1.5];

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
            data.id,
            data.targetInfo?.userId,
            data.targetInfo?.nickName,
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
          // 게시글 삭제 버튼 (게시글 신고일 때만)
          selectedReport?.reportType === "post" && (
            <Button
              key="deletePost"
              danger
              style={{ marginRight: 170 }}
              onClick={() => {
                if (!selectedReport?.targetInfo.postId) {
                  message.warning("postId가 없습니다.");
                  return;
                }

                confirm({
                  title: "게시글 삭제 확인",
                  content: "정말로 해당 게시글을 삭제하시겠습니까?",
                  okText: "삭제",
                  cancelText: "취소",
                  okButtonProps: {
                    danger: true,
                  },
                  async onOk() {
                    try {
                      await dispatch(
                        deletePostByAdmin(selectedReport.targetInfo.postId!)
                      ).unwrap();
                      message.success("게시글이 삭제되었습니다.");
                      await dispatch(getAdminReports());
                      setIsModalOpen(false);
                    } catch (err) {
                      console.error(err);
                      message.error("게시글 삭제 오류");
                    }
                  },
                });
              }}
            >
              게시글 삭제
            </Button>
          ),
          // 댓글 삭제 버튼 (댓글 신고일 때만)
          selectedReport?.reportType === "comment" && (
            <Button
              key="deleteComment"
              danger
              style={{ marginRight: 182 }}
              onClick={() => {
                if (!selectedReport?.targetInfo.commentId) {
                  message.warning("commentId가 없습니다.");
                  return;
                }

                confirm({
                  title: "댓글 삭제 확인",
                  content: "정말로 해당 댓글을 삭제하시겠습니까?",
                  okText: "삭제",
                  cancelText: "취소",
                  okButtonProps: {
                    danger: true,
                  },
                  async onOk() {
                    try {
                      await dispatch(
                        deleteCommentByAdmin(
                          selectedReport.targetInfo.commentId!
                        )
                      ).unwrap();
                      message.success("댓글이 삭제되었습니다.");
                      await dispatch(getAdminReports());
                      setIsModalOpen(false);
                    } catch (err) {
                      console.error(err);
                      message.error("댓글 삭제 실패");
                    }
                  },
                });
              }}
            >
              댓글 삭제
            </Button>
          ),
          // 블랙리스트 추가 버튼
          <Button
            key="markResolved"
            type="primary"
            style={{ backgroundColor: "black" }}
            onClick={() => setIsBlacklistModalOpen(true)}
          >
            블랙리스트 추가
          </Button>,
          <Button key="close" type="default" onClick={handleCloseModal}>
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

      {/* 블랙리스트 모달 */}
      <Modal
        title="블랙리스트 사유 입력"
        open={isBlacklistModalOpen}
        onCancel={() => setIsBlacklistModalOpen(false)}
        onOk={handleAddToBlacklist}
        cancelText="취소"
        okText="추가"
        okButtonProps={{
          style: { backgroundColor: "black", borderColor: "black" },
          type: "primary",
        }}
      >
        <p>
          <strong>대상 닉네임:</strong>{" "}
          {selectedReport?.targetInfo.nickName || "알 수 없음"}
        </p>
        <Input.TextArea
          rows={4}
          placeholder="블랙리스트 추가 사유를 입력해주세요."
          value={blacklistReason}
          onChange={(e) => setBlacklistReason(e.target.value)}
        />
      </Modal>
    </ReportsCompStyled>
  );
};

export default ReportsComp;
