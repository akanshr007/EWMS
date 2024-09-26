import { useFormik } from "formik";
import { LockIcon } from "../../../assets/icons/icons";
import {
  REGEX,
  ROUTES,
  VALIDATION_MESSAGES,
  Yup,
} from "../../../utils/constants";
import Button from "../../common/Button/Button";
import Password from "../../common/form/Password/Password";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useResetPasswordMutation, useSetPasswordMutation } from "services/api";

const ResetPassword = () => {
  // Hooks
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const [setPassword, { data, isLoading }] = useSetPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();

  // Constants
  const token = params?.key;

  const validateToken = () => {
    try {
      // Check if the token in params is valid or not
      // If not, throw an error.
      if (false) {
        throw new Error("Token is not valid");
      }
    } catch (error) {
      console.error("🚀 ~ validateToken ~ error:", error);
      throw new Error("Token is not valid");
    }
  };

  const formSubmitHandler = async (values: any, action: any) => {
    action.setSubmitting(true);
    const { password, confirmPassword } = values;
    try {
      const data = {
        newPassword: password,
        confirmPassword,
        token,
      };
      const res = !!location?.state?.isResetPassword
        ? await resetPassword(data).unwrap()
        : await setPassword(data).unwrap();

      if (res && res?.error === false) {
        toast.success(res?.message);
        // navigate(ROUTES.ROOT);

        navigate(ROUTES.ROOT, { replace: true });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.success(res?.message ? res?.message : "Something went wrong");


      }
    } catch (error) {
      console.error("🚀 ~ formSubmitHandler ~ error:", error);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } finally {
      action.setSubmitting(false);
    }
  };

  // Formik
  const initialValues = {
    password: "",
    confirmPassword: "",
  };
  const validationSchema = Yup.object({
    password: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED("password"))
      .label("Password")
      .matches(REGEX.PASSWORD, VALIDATION_MESSAGES.WRONG_PASSWORD),
    confirmPassword: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED("confirm password"))
      .label("Confirm Password")
      .oneOf([Yup.ref("password")], VALIDATION_MESSAGES.MATCH_PASSWORDS),
  });
  const formik = useFormik<typeof initialValues>({
    initialValues,
    validationSchema,
    onSubmit: formSubmitHandler,
  });

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <>
      <h2>Set Password</h2>
      <p className="sub_txt">Set your password.</p>
      <form onSubmit={formik.handleSubmit}>
        <Password
          label="Password"
          placeholder="••••••••••"
          formik={formik}
          {...formik.getFieldProps("password")}
          className="form_input"
          icon={<LockIcon />}
        />
        <Password
          label="Confirm Password"
          placeholder="••••••••••"
          formik={formik}
          {...formik.getFieldProps("confirmPassword")}
          icon={<LockIcon />}
        />
        <Button
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
          className="submit_btn"
          loading={formik.isSubmitting}
          fluid
        >
          Submit
        </Button>
      </form>
    </>
  );
};

export default ResetPassword;
