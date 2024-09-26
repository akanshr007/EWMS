import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetPermissionsQuery } from "services/api";
import usePermissionsRoute from "hooks/usePermissionsRoute";

const PermissionsGuard = ({ children }: any) => {
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const removeParamsFromPath = (path: string): string => {
    const pathSegments = path.split("/");
    return pathSegments.length > 1 ? `/${pathSegments[1]}` : path;
  };
  const basePath = removeParamsFromPath(pathname);
  const getPermittedRoutes = usePermissionsRoute();

  // API
  const { data: permissionsData, isSuccess: permissionsFetched } =
    useGetPermissionsQuery({});
  const permittedRoutes = useMemo(() => {
    const permissions = permissionsData?.rows;
    const routes = getPermittedRoutes(permissions);
    return routes;
  }, [permissionsData, permissionsFetched]);

  const hasPermission = permittedRoutes?.includes(basePath);

  if (permissionsFetched) {
    return hasPermission ? children : navigate("/");
  }
};

export default PermissionsGuard;
