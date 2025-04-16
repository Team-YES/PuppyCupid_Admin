import DashBoard from "@/features/DashPage";
import Loading from "@/components/Loading";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Home = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   const token = Cookies.get("access_token");

  //   if (!token) {
  //     router.replace("/login");
  //   }
  // }, [router]);

  // const token = Cookies.get("access_token");

  // if (!token) {
  //   return <Loading />; // 또는 return null;
  // }

  return <DashBoard />;
};
export default Home;
