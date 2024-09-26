import { FormikHelpers, useFormik } from "formik";
import Input from "../../common/form/Input/Input";
import {
  READABLE_ROUTES,
  REGEX,
  ROUTES,
  VALIDATION_MESSAGES,
  Yup,
} from "../../../utils/constants";
import Password from "../../common/form/Password/Password";
import Button from "../../common/Button/Button";
import { Email, LockIcon } from "../../../assets/icons/icons";
import { Link, useNavigate } from "react-router-dom";
import { useLazyGetPermissionsQuery, useLoginMutation } from "services/api";
import usePermissionsRoute from "hooks/usePermissionsRoute";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  // Hooks
  const navigate = useNavigate();
  const getPermittedRoutes = usePermissionsRoute();

  // API
  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const [fetchPermissions, { isSuccess: permissionsFetched }] =
    useLazyGetPermissionsQuery({});

  // Formik
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED("your email"))
      .matches(REGEX.EMAIL, VALIDATION_MESSAGES.WRONG_EMAIL)
      .label("Email"),
    password: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED("password"))
      .label("Password")
    // .matches(REGEX.PASSWORD, VALIDATION_MESSAGES.WRONG_PASSWORD),
  });

  const fetchPermissionsAndNavigate = async () => {
    fetchPermissions({}).then((res) => {
      const permissions = res?.data?.rows;
      const routes = getPermittedRoutes(permissions);
      if (routes?.length > 0) {
        for (const r of routes) {
          if (READABLE_ROUTES?.includes(r)) {
            navigate(r);
            break;
          }
        }
      }
    });
  };

  const loginSubmitHandler = async (
    values: LoginFormValues,
    action: FormikHelpers<LoginFormValues>
  ) => {
    action.setSubmitting(true);
    try {
      const response = await login(values).unwrap();
      if (response && response?.error === false) {
        const token = response?.data?.token;
        localStorage.setItem("token", token);
        await fetchPermissionsAndNavigate();
      } else {
        throw response;
      }
    } catch (error) {
      console.error("🚀 ~ loginSubmitHandler ~ error:", error);
      // action.resetForm();
    } finally {
      action.setSubmitting(false);
    }
  };

  const formik = useFormik<typeof initialValues>({
    initialValues,
    validationSchema,
    onSubmit: loginSubmitHandler,
  });

  return (
    <>
      <h2>Login</h2>
      {/* <p className="sub_txt">Sign in to access your personalized dashboard.</p> */}
      <form onSubmit={formik.handleSubmit}>
        <Input
          label="Email"
          placeholder="Enter your email address"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          value={formik.values.email}
          className="form_input"
          icon={<Email />}
          formik={formik}
        />
        <Password
          label="Password"
          placeholder="••••••••••"
          formik={formik}
          {...formik.getFieldProps("password")}
          icon={<LockIcon />}
        />
        <Link className="forgot_txt" to={ROUTES.FORGOT_PASSWORD}>
          Forgot your password?
        </Link>
        <Button
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
          className="submit_btn"
          loading={formik.isSubmitting}
          fluid
        >
          Submit
        </Button>
        {/* <p className="sign_up_txt">
          Don't have an account? <Link to={ROUTES.REGISTER}>Sign up here.</Link>
        </p> */}
      </form>
    </>
  );
};

export default Login;
