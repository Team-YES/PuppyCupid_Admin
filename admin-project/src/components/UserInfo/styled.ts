import styled from "styled-components";

export const UserInfoStyled = styled.div`
  .userInfo_table {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding: 8px 0;
  }
`;

export const Cell = styled.div<{ $flex: number }>`
  flex: ${({ $flex }) => $flex};
  text-align: center;
  /* border-bottom: 1px solid #ddd; */
`;
