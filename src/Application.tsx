import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout/MainLayout";
import OnboardLayout from "./components/layout/OnboardLayout/OnboardLayout";
import ChangePassword from "./components/pages/ChangePassword/ChangePassword";
import ErrorPage from "./components/pages/ErrorPage/ErrorPage";
import ForgotPassword from "./components/pages/ForgotPassword/ForgotPassword";
import Login from "./components/pages/Login/Login";
import PageNotFound from "./components/pages/PageNotFound/PageNotFound";
import Reports from "./components/pages/Reports/Reports";
import ResetPassword from "./components/pages/ResetPassword/ResetPassword";
import CreateProjets from "components/pages/CreateProjets/CreateProjets";
import Projects from "components/pages/Projects/Projects";
import { ROUTES } from "./utils/constants";
import NoGuard from "./app/guards/NoGuard";
import Guard from "./app/guards/Guard";
import Employee from "components/pages/Employee/Employee";
import AddReport from "components/pages/AddReport/AddReport";
import PermissionsGuard from "app/guards/PermissionsGuard";

const Application = () => {
  const router = createBrowserRouter([
    {
      path: ROUTES.ROOT,
      element: (
        <NoGuard>
          <OnboardLayout />
        </NoGuard>
      ),
      ErrorBoundary: ErrorPage,
      children: [
        {
          index: true,
          element: <Login />,
        },

        {
          path: ROUTES.FORGOT_PASSWORD,
          element: <ForgotPassword />,
        },
        {
          path: `${ROUTES.SET_PASSWORD}/:key`,
          element: <ResetPassword />,
        },
      ],
    },
    {
      element: (
        <Guard>
          <MainLayout />
        </Guard>
      ),
      ErrorBoundary: ErrorPage,
      children: [
        // Auth
        {
          path: ROUTES.CHANGE_PASSWORD,
          element: <ChangePassword />,
        },

        // Reports
        {
          path: ROUTES.REPORTS,
          element: (
            <PermissionsGuard>
              <Reports />
            </PermissionsGuard>
          ),
        },
        {
          path: ROUTES.ADD_REPORT,
          element: (
            <PermissionsGuard>
              <AddReport />
            </PermissionsGuard>
          ),
        },

        // Projects
        {
          path: ROUTES.PROJECTS,
          element: (
            <PermissionsGuard>
              <Projects />
            </PermissionsGuard>
          ),
        },
        {
          path: ROUTES.CREATE_PROJECT,
          element: (
            <PermissionsGuard>
              <CreateProjets />
            </PermissionsGuard>
          ),
        },
        {
          path: `${ROUTES.EDIT_PROJECT}/:id`,
          element: (
            <PermissionsGuard>
              <CreateProjets />
            </PermissionsGuard>
          ),
        },

        // Employees
        {
          path: ROUTES.EMPLOYEES,
          element: (
            <PermissionsGuard>
              <Employee />
            </PermissionsGuard>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Application;
