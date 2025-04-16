import TitleCompo from "@/components/TitleCompo";
import { DashStyled } from "./styled";
import PrivateRoute from "@/components/PrivateRoute";
const DashBoard = () => {
  return (
    <PrivateRoute>
      <DashStyled>
        <TitleCompo title="대시보드" />
      </DashStyled>
    </PrivateRoute>
  );
};
export default DashBoard;
