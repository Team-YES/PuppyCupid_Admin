import Header from "@/features/Header";
import NotPc from "@/features/NotPc";
import Template from "@/layouts/Template";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Component, pageProps : App컴포넌트를 호출할 때 자동으로 넘겨주는 값
export default function App({ Component, pageProps }: AppProps) {
  const [notPc, setNotPc] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
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
        <title>관리자 페이지</title>
      </Head>

      {notPc ? (
        <NotPc />
      ) : (
        <>
          <Header />
          <Provider store={store}>
            <Template>
              <Component {...pageProps} />
            </Template>
          </Provider>
        </>
      )}
    </>
  );
}
