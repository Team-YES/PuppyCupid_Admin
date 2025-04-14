import { Pagination } from "antd";

interface PaginationWrapperProps {
  currentPage: number;
  total: number;
  onChange: (page: number) => void;
  pageSize?: number;
}

const PaginationWrapper = ({
  currentPage,
  total,
  onChange,
  pageSize = 10, // 기본값 설정
}: PaginationWrapperProps) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
      />
    </div>
  );
};

export default PaginationWrapper;
