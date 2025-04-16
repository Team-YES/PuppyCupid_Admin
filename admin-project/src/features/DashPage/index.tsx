import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import TitleCompo from "@/components/TitleCompo";
import { DashStyled } from "./styled";

const DashBoard = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAdminLogin = async () => {
      try {
        // 서버에서 로그인 상태 확인
        const response = await axios.get(
          "http://localhost:5000/auth/adminCheck",
          {
            withCredentials: true,
          }
        );

        if (response.data.isLoggedIn) {
          console.log("User is authenticated");
        } else {
          console.log("User is not authenticated, redirecting to login");
          router.push("/login"); // 로그인 페이지로 리다이렉트
        }
      } catch (error) {
        console.log("Error during authentication check", error);
        router.push("/login"); // 로그인 페이지로 리다이렉트
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
