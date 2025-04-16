import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      alert("로그인이 필요합니다.");
      router.push("/login");
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return <Loading />;
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
