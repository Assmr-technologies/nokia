import { createContext, useCallback, useEffect, useState } from "react";
import { postRequest, baseUrl } from "../utils/services";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    setUser(JSON.parse(user));
  }, []);

  const [registerError, setRegisterError] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const updateRegisterInfo = useCallback(info => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback(info => {
    setLoginInfo(info);
  }, []);

  const RegisterUser = useCallback(
    async event => {
      event.preventDefault();
      setRegisterLoading(true);
      setRegisterError(null);
      const response = await postRequest(
        `${baseUrl}register`,
        JSON.stringify(registerInfo)
      );

      setRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      }
      toast.success("user registered successfully");
      // <Navigate to="/login" />;
      sessionStorage.setItem("user", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const logoutUser = useCallback(() => {
    sessionStorage.removeItem("user");
    setUser(null);
  }, []);

  const loginUser = useCallback(
    async event => {
      event.preventDefault();
      setLoginLoading(true);
      setLoginError(null);
      const response = await postRequest(
        `${baseUrl}login`,
        JSON.stringify(loginInfo)
      );
      setLoginLoading(false);

      if (response.error) {
        return setLoginError(response);
      }
      toast.success("user loggedIn successfully");
      sessionStorage.setItem("user", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        registerInfo,
        updateRegisterInfo,
        RegisterUser,
        registerError,
        registerLoading,
        logoutUser,
        loginUser,
        updateLoginInfo,
        loginError,
        loginLoading,
        loginInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
