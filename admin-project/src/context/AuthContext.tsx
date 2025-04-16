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

type UserState = {
  id: number;
  email: string;
  password?: string | null;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: UserState | null;
  loading: boolean; // ✅ 추가
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
  const [loading, setLoading] = useState(true); // ✅ 추가
  const dispatch = useDispatch<AppDispatch>();

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
        setUser(userData);

        dispatch(
          setReduxUser({
            id: Number(response.data.user.id),
            email: String(response.data.user.email),
          })
        );
      } else {
        setIsLoggedIn(false);
        setUser(null);
        dispatch(logoutUser());
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      dispatch(logoutUser());
    } finally {
      setLoading(false); // ✅ 로그인 여부 확인이 끝났을 때만 false
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const login = () => {};
  const logout = () => {};

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, loading, checkLogin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
