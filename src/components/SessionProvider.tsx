import React, {
  useState,
  useContext,
  ReactNode,
  createContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import { useAppDispatch } from "../redux/hooks";
import { USER_LOGIN_SUCCESS } from "../redux/types/user";
type SessionContextType = {
  token: string;
  getToken: () => Promise<null | undefined>;
  getSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType>(
  {} as SessionContextType
);

export function SessionProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [token, setToken] = useState<string>("");
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const getToken = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/csrf/`, {
        withCredentials: true,
      });
      const token = response.headers["x-csrftoken"];
      setToken(token);
    } catch (error) {
      console.error("Failed to retrieve CSRF token:", error);
      return null;
    }
  };

  const getSession = async () => {
    await axios
      .get(`${BASE_URL}/api/user/session/`, { withCredentials: true })
      .then((res) => {
        if (res.data.isAuthenticated) {
          getUserFromSession();
          dispatch({ type: "session/search", payload: res.data.search });
          let orderKey = res.data.orderKey;
          let order = "INC";
          if (orderKey[0] === "-") {
            order = "DEC";
            orderKey = orderKey.slice(1);
          }
          dispatch({ type: "session/orderKey", payload: orderKey });
          dispatch({ type: "session/order", payload: order });
          dispatch({ type: "session/selected", payload: res.data.selected });
        } else {
          getToken();
        }
      })
      .catch((err) => console.log(err));
  };

  const getUserFromSession = async () => {
    await axios
      .get(`${BASE_URL}/api/user/me/`, { withCredentials: true })
      .then((res) => {
        dispatch({
          type: USER_LOGIN_SUCCESS,
          payload: res.data.email,
        });
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <SessionContext.Provider value={{ token, getToken, getSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSessionContext = () => {
  return useContext(SessionContext);
};
