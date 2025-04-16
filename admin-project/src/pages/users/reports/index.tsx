import ReportsComp from "@/components/Reports";
import PrivateRoute from "@/components/PrivateRoute";
const Reports = () => {
  return (
    <PrivateRoute>
      <ReportsComp title={"신고 정보"} />
    </PrivateRoute>
  );
};
export default Reports;
