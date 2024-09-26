import { useDispatch } from "react-redux";
import { setUserPermissions } from "../redux/slices/user.slice";
import { MODULE_ROUTES } from "utils/constants";

type Rule = "READ" | "WRITE";
const usePermissionsRoute = () => {
  const dispatch = useDispatch();

  const getModuleRoutes = (moduleId: string, rules: Rule[]) => {
    const routes: string[] = [];
    rules.forEach((rule) => {
      if (MODULE_ROUTES[moduleId] && MODULE_ROUTES[moduleId][rule]) {
        routes.push(...MODULE_ROUTES[moduleId][rule]);
      }
    });
    return routes;
  };

  const getPermittedRoutes = (permissions: any[]) => {
    const routes: string[] = [];
    permissions?.forEach((p: any) => {
      const moduleRoutes = getModuleRoutes(p.moduleId, p.rules);
      routes.push(...moduleRoutes);
    });
    dispatch(setUserPermissions(routes));
    return routes;
  };

  return getPermittedRoutes;
};

export default usePermissionsRoute;
