import { FC, ReactElement, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "utils/constants";
import { isLoggedIn } from "../../utils/helpers";

const Guard: FC<{ children: ReactElement } | null> = ({ children }: any) => {
  const location = useLocation();

  if (isLoggedIn()) {
    return <>{children}</>;
  } else {
    return <Navigate to={ROUTES.ROOT} replace />;
  }
};

export default Guard;
