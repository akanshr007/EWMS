import { useState, useEffect } from "react";

const useAuth = (): [boolean, () => void] => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    if (token !== "null" && token !== "undefined" && token !== "") {
      setIsAuthenticated(!!token);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return [isAuthenticated, checkAuthStatus];
};

export default useAuth;
