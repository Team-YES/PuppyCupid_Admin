// src/components/PrivateRoute.tsx
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCheckingAuth(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!checkingAuth && !isLoggedIn) {
      alert("로그인이 필요합니다.");
      router.push("/login");
    }
  }, [checkingAuth, isLoggedIn, router]);

  if (checkingAuth) {
    return <Loading />;
  }

  if (!isLoggedIn) {
    return null; // 위에서 푸시하고 있으니 아무것도 렌더 안 함
  }

  return <>{children}</>;
};

export default PrivateRoute;
