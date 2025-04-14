import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { HeaderStyled } from "./styled";
import clsx from "clsx";

export interface HeaderProps {
  className?: string;
}

//해당하는 URL은 Header가 표시되지 않습니다.
export const nonePageObject = ["/login"];

const Header = ({ className }: HeaderProps) => {
  // 라우터
  const router = useRouter();
  // 현재 경로
  const pathname = router?.pathname;

  return (
    <HeaderStyled
      className={clsx(
        "Header",
        nonePageObject.some((x) => {
          if (x === "/") {
            return pathname === "/";
          }
          return pathname.includes(x);
        }) && "headerOff",
        className
      )}
    >
      <div className="navigation">
        <div className="left">
          <Link href="/">
            <i className="fa-solid fa-paw"></i> 소개팅 ADMIN PAGE
          </Link>
        </div>
      </div>
    </HeaderStyled>
  );
};

export default Header;
