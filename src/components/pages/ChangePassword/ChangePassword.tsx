import { FormikHelpers, useFormik } from "formik";
import { Container } from "react-bootstrap";
import { LockIcon } from "../../../assets/icons/icons";
import {
  REGEX,
  ROUTES,
  VALIDATION_MESSAGES,
  Yup,
} from "../../../utils/constants";
import "./ChangePassword.scss";
import Button from "../../common/Button/Button";
import Password from "../../common/form/Password/Password";
import PageHeading from "../../common/PageHeading/PageHeading";
import { useChangePasswordMutation } from "services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  // Hooks
  const navigate = useNavigate();

  // API
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  // Formik
  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED("password"))
      .label("Password")
      .matches(REGEX.PASSWORD, VALIDATION_MESSAGES.WRONG_PASSWORD),
    newPassword: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED("new password"))
      .label("New Password")
      .matches(REGEX.PASSWORD, VALIDATION_MESSAGES.WRONG_PASSWORD),
    confirmPassword: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED("confirm password"))
      .oneOf([Yup.ref("newPassword")], VALIDATION_MESSAGES.MATCH_PASSWORDS)
      .label("Confirm Password"),
  });

  const formSubmitHandler = async (
    values: FormValues,
    action: FormikHelpers<FormValues>
  ) => {
    action.setSubmitting(true);
    try {
      const response = await changePassword(values).unwrap();
      if (response && response?.error === false) {
        localStorage.clear();
        toast.success("Password changed successfully");
        // navigate(ROUTES.ROOT);
        navigate(ROUTES.ROOT, { replace: true });
      } else {
        throw response;
      }
    } catch (error) {
      console.error("🚀 ~ ChangePassword ~ error:", error);
      action.resetForm();
    } finally {
      action.setSubmitting(false);
    }
  };
  const formik = useFormik<typeof initialValues>({
    initialValues,
    validationSchema,
    onSubmit: formSubmitHandler,
  });
  return (
    <section className="change_password_page">
      <Container>
        <div className="form_card">
          <PageHeading
            title="Change Password"
            subTitle="Enter your old password to change to new password"
          />
          <form onSubmit={formik.handleSubmit}>
            <Password
              label="Old Password"
              placeholder="••••••••••"
              formik={formik}
              {...formik.getFieldProps("oldPassword")}
              icon={<LockIcon />}
              className="form_input"
            />
            <Password
              label="New Password"
              placeholder="••••••••••"
              formik={formik}
              {...formik.getFieldProps("newPassword")}
              icon={<LockIcon />}
              className="form_input"
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
        </div>
      </Container>
    </section>
  );
};

export default ChangePassword;
