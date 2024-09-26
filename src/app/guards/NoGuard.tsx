import { Navigate } from "react-router-dom";
import { ROUTES } from "utils/constants";
import { isLoggedIn } from "utils/helpers";

const NoGuard = ({ children }: { children: React.ReactElement }) => {
  if (isLoggedIn()) {
    return <Navigate to={ROUTES?.REPORTS} replace />;
  } else {
    return children;
  }
};

export default NoGuard;
