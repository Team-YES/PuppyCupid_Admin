import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import TitleCompo from "@/components/TitleCompo";
import { DashStyled } from "./styled";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const DashBoard = () => {
  const router = useRouter();
  const alertedRef = useRef(false);

  // 로그인 상태가 아닐 경우 /login으로 리다이렉트
  useEffect(() => {
    const checkAdminLogin = async () => {
      try {
        // 쿠키에서 access_token 가져오기
        const token = Cookies.get("access_token");

        // 서버에서 로그인 상태 확인
        const response = await axios.get(`${baseURL}/auth/adminCheck`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 로그인이 안 된 경우
        if (!response.data.isLoggedIn) {
          if (!alertedRef.current) {
            alert("로그인이 필요합니다.");
            alertedRef.current = true;
          }
          router.push("/login");
        }
      } catch (error) {
        console.log("로그인 체크 에러", error);
        router.push("/login");
      }
    };

    checkAdminLogin();
  }, [router]);

  return (
    <DashStyled>
      <TitleCompo title="대시보드" />
    </DashStyled>
  );
};

export default DashBoard;
