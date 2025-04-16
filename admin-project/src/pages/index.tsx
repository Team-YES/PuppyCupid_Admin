import DashBoard from "@/features/DashPage";
import Loading from "@/components/Loading";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import PrivateRoute from "@/components/PrivateRoute";
const Home = () => {
  return (
    <PrivateRoute>
      <DashBoard />
    </PrivateRoute>
  );
};
export default Home;
