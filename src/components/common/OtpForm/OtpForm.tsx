import { FormikHelpers, useFormik } from "formik";
import { Email } from "../../../assets/icons/icons";
import logo from "../../../assets/logos/antier-logo.webp";
import { ROUTES, VALIDATION_MESSAGES, Yup } from "../../../utils/constants";
import Button from "../../common/Button/Button";
import { useNavigate } from "react-router-dom";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from "services/api";
import { useState } from "react";
import OTPInput from "react-otp-input";
import Label from "components/common/form/Label/Label";
import Error from "../form/Error/Error";

interface FormValues {
  otp: string;
}

interface PropsType {
  data: any;
}

const OtpForm = (props: PropsType) => {
  const { data } = props;
  // Hooks
  const navigate = useNavigate();

  // API
  const [verifyOTP, { isLoading }] = useVerifyOtpMutation();

  const initialValues = {
    otp: "",
  };
  const validationSchema = Yup.object({
    otp: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED("otp"))
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
      .label("Otp"),
  });

  const formSubmitHandler = async (
    values: FormValues,
    action: FormikHelpers<FormValues>
  ) => {
    try {
      action.setSubmitting(true);
      const payload = {
        email: data,
        otp: values.otp,
      };
      const res = await verifyOTP(payload).unwrap();
      if (res && res?.error === false) {
        const token = res?.data?.token;
        navigate(`${ROUTES.SET_PASSWORD}/${token}`, {
          state: {
            isResetPassword: true,
          },
        });
        window.location.reload();
      } else {
        throw res;
      }

    } catch (error) {
      console.error("🚀 ~ ForgotPassword ~ error:", error);
      window.location.reload(); // Reload in case of an error
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
      <Label>OTP</Label>
      <form onSubmit={formik.handleSubmit}>
        <div className="otp_input">
          <OTPInput
            numInputs={6}
            value={formik.values.otp}
            onChange={(value) => {
              formik.setFieldValue("otp", value);
            }}
            inputType="number"
            renderInput={(props) => (
              <input
                {...props}
                onBlur={(value) => {
                  formik.setFieldTouched("otp", true);
                }}
              />
            )}
          />
        </div>
        {formik.touched.otp && formik.errors.otp ? (
          <Error>{formik.errors.otp}</Error>
        ) : null}
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

export default OtpForm;
