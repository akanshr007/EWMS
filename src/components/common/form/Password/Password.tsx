import { InputHTMLAttributes, ReactNode, useState } from "react";
import Error from "../Error/Error";
import Label from "../Label/Label";
import { CloseEye, OpenEye } from "../../../../assets/icons/icons";
import { FormikHelpers, FormikProps, FormikValues, getIn } from "formik";

type propTypes<T> = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  error?: string;
  icon?: ReactNode;
  formik: FormikProps<T>;
};

const Password = <T extends FormikValues>(props: propTypes<T>) => {
  const { className, icon, name, label, formik, ...rest } = props;

  // Get Error and Touched
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);

  const [show, setShow] = useState(false);
  return (
    <div className={`${className || ""} custom_input`}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <div className={`input_in ${icon ? "icon_input" : ""} right_icon_input`}>
        {icon && <span className="input_icon">{icon}</span>}
        <input
          {...rest}
          {...formik}
          type={show ? "text" : "password"}
          name={name}
          id={name}
        />
        <button
          type="button"
          className="input_right_icon"
          onClick={() => setShow(!show)}
        >
          {show ? <OpenEye /> : <CloseEye />}
        </button>
      </div>
      {error && touched && <Error>{error}</Error>}
    </div>
  );
};

export default Password;
