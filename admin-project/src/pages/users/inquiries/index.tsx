import InquiriesComp from "@/components/Inquiries";
import PrivateRoute from "@/components/PrivateRoute";

const Inquires = () => {
  return (
    <PrivateRoute>
      <InquiriesComp title={"문의 정보"} />
    </PrivateRoute>
  );
};
export default Inquires;
