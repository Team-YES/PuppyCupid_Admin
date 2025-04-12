import styled from "styled-components";

export const UserInfoStyled = styled.div`
  .userInfo_title {
    margin-bottom: 15px;
    font-weight: 700;
    font-size: 20px;
  }

  .userInfo_table {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding: 8px 0;
  }

  .userInfo_cell {
    text-align: center;
  }
`;

export const Cell = styled.div<{ $flex: number }>`
  flex: ${({ $flex }) => $flex};
  text-align: center;
  /* border-bottom: 1px solid #ddd; */
`;
