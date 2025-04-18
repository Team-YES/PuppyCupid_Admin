import axios from "axios";
import { LoginFeatStyled } from "./styled";
import { Form, Input, Button } from "antd";
import { useRouter } from "next/router";

const LoginFeat = () => {
  const router = useRouter();

  // 로그인 정보 전송
  const onFinish = async (values: { id: string; password: string }) => {
    console.log("로그인 정보:", values);

    try {
      const res = await axios.post(
        "http://localhost:5001/auth/adminLogin",
        {
          email: values.id,
          password: values.password,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.ok) {
        console.log("로그인 성공", res.data);
        router.push("/");
      }
    } catch (err: any) {
      console.error("로그인 실패:", err);
    }
  };

  return (
    <LoginFeatStyled>
      <div className="Login_container">
        {/* 헤더 */}
        <div className="Login_header">
          <div className="Login_logo">Puppy Cupid</div>
          <div className="Login_title">관리자 로그인</div>
        </div>

        {/* 로그인 폼 */}
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          style={{ maxWidth: 360, margin: "0 auto" }}
        >
          <Form.Item
            // label="아이디"
            name="id"
            rules={[{ required: true, message: "아이디를 입력해주세요" }]}
          >
            <Input placeholder="아이디를 입력하세요." />
          </Form.Item>

          <Form.Item
            // label="비밀번호"
            name="password"
            rules={[{ required: true, message: "비밀번호를 입력해주세요" }]}
            style={{ marginBottom: 30 }}
          >
            <Input.Password placeholder="비밀번호를 입력하세요." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                borderRadius: 20,
                height: 37,
                backgroundColor: "#9855f3",
                fontWeight: 700,
              }}
            >
              로그인
            </Button>
          </Form.Item>
        </Form>
      </div>
    </LoginFeatStyled>
  );
};

export default LoginFeat;
