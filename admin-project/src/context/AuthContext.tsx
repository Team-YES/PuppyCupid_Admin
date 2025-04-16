import type { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { setReduxUser, logoutUser } from "@/store/slices/userSlice";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";

type UserState = {
  id: number;
  email: string;
  password?: string | null;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: UserState | null;
  checkLogin: () => void;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserState | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // 서버에서 로그인 상태를 확인하는 함수
  const checkLogin = async () => {
    try {
      const token = Cookies.get("access_token");

      const response = await axios.get(
        "http://localhost:5000/auth/adminCheck",
        {
          withCredentials: true,
        }
      );

      if (response.data.isLoggedIn) {
        setIsLoggedIn(true);

        const userData: UserState = {
          id: response.data.user.id,
          email: response.data.user.email,
          password: null,
        };
        setUser(userData); // ✅ 이건 AuthContext 내부 state에 사용

        const userDataForRedux = {
          id: Number(response.data.user.id),
          email: String(response.data.user.email),
        };

        dispatch(setReduxUser(userDataForRedux)); // ✅ 이건 Redux 전용으로 타입 맞춰서 전송
      } else {
        setIsLoggedIn(false);
        setUser(null);
        dispatch(logoutUser());
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      dispatch(logoutUser());
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const login = () => {};
  const logout = () => {};

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, checkLogin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
