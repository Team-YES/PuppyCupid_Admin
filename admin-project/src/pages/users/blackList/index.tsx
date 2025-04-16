import BlackListComp from "@/components/BlackListComp";
import PrivateRoute from "@/components/PrivateRoute";

const BlackList = () => {
  return (
    <PrivateRoute>
      <BlackListComp title={"블랙리스트 관리"}></BlackListComp>
    </PrivateRoute>
  );
};

export default BlackList;
