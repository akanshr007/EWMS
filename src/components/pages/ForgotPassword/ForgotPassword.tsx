import { FormikHelpers, useFormik } from "formik";
import { Email } from "../../../assets/icons/icons";
import logo from "../../../assets/logos/antier-logo.webp";
import {
  REGEX,
  ROUTES,
  VALIDATION_MESSAGES,
  Yup,
} from "../../../utils/constants";
import Button from "../../common/Button/Button";
import Input from "../../common/form/Input/Input";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "services/api";
import "./ForgotPassword.scss";
import { useState } from "react";
import OTPInput from "react-otp-input";
import Label from "components/common/form/Label/Label";
import OtpForm from "components/common/OtpForm/OtpForm";

interface FormValues {
  email: string;
}

const ForgotPassword = () => {
  // Hooks
  const navigate = useNavigate();

  // API
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  // State
  const [isOtpScreen, setIsOtpScreen] = useState<boolean>(false);

  const initialValues = {
    email: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED("your email"))
      .matches(REGEX.EMAIL, VALIDATION_MESSAGES.WRONG_EMAIL)
      .label("Email"),
  });

  const formSubmitHandler = async (
    values: FormValues,
    action: FormikHelpers<FormValues>
  ) => {
    try {
      action.setSubmitting(true);
      const res = await forgotPassword(values).unwrap();
      if (res && res?.error === false) {
        setIsOtpScreen(true);
      } else {
        throw res;
      }
    } catch (error) {
      console.error("🚀 ~ ForgotPassword ~ error:", error);
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
    <>
      <h2>Forgot Password</h2>

      {isOtpScreen ? (
        <OtpForm data={formik.values.email} />
      ) : (
        <>
          <p className="sub_txt">Enter your email to reset your password.</p>
          <form onSubmit={formik.handleSubmit}>
            {/* Email */}
            <Input
              label="Email"
              placeholder="Enter your email address"
              type="email"
              className="form_input"
              formik={formik}
              {...formik.getFieldProps("email")}
              icon={<Email />}
            />
            <Button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="submit_btn"
              loading={formik.isSubmitting}
              fluid
            >
              Send OTP
            </Button>
          </form>
        </>
      )}
    </>
  );
};

export default ForgotPassword;
