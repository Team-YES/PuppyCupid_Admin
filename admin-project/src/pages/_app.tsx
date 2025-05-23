import Header from "@/features/Header";
import NotPc from "@/features/NotPc";
import Template from "@/layouts/Template";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { store } from "@/store/store";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRouter } from "next/router";
import { AuthProvider } from "@/context/AuthContext";
// Component, pageProps : App컴포넌트를 호출할 때 자동으로 넘겨주는 값
export default function App({ Component, pageProps }: AppProps) {
  const [notPc, setNotPc] = useState(false);
  const router = useRouter();

  const isLoginPage = router.pathname === "/login"; // 현재 라우터 경로 체크

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 800) {
        setNotPc(true);
      } else {
        setNotPc(false);
      }
    };

    // 초기 width 확인
    handleResize();

    // resize 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/icon.png" />
        <title>관리자 페이지</title>
      </Head>

      {notPc ? (
        <NotPc />
      ) : (
        <>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#9855f3",
              },
            }}
          >
            <Provider store={store}>
              <AuthProvider>
                {isLoginPage ? (
                  <Component {...pageProps} />
                ) : (
                  <>
                    <Header />
                    <Template>
                      <Component {...pageProps} />
                    </Template>
                  </>
                )}
              </AuthProvider>
            </Provider>
          </ConfigProvider>
        </>
      )}
    </>
  );
}
