import UserInfo from "@/components/UserInfo";
import PrivateRoute from "@/components/PrivateRoute";

const UserManage = () => {
  return (
    <PrivateRoute>
      <UserInfo title={"회원 정보"} />
    </PrivateRoute>
  );
};
export default UserManage;
