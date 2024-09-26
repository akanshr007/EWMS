import { InputHTMLAttributes, ReactNode } from "react";
import Error from "../Error/Error";
import Label from "../Label/Label";
import "./Input.scss";
import { FormikProps, FormikValues, getIn } from "formik";

type propTypes<T> = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  formik?: FormikProps<T>;
};

const Input = <T extends FormikValues>(props: propTypes<T>) => {
  const {
    className,
    icon,
    rightIcon,
    name,
    formik,
    label,
    disabled,
    value,
    maxLength,
    ...rest
  } = props;

  // Get Error and Touched
  const error = name && formik ? getIn(formik.errors, name) : undefined;
  const touched = name && formik ? getIn(formik.touched, name) : undefined;

  return (
    <div className={`${className || ""} custom_input`}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <div
        className={`input_in ${icon ? "icon_input" : ""} ${rightIcon ? "right_icon_input" : ""
          } ${disabled ? "disabled" : ""}`}
      >
        {icon && <span className="input_icon">{icon}</span>}
        <input
          type={"text"}
          {...rest}
          {...formik}
          value={value && value}
          name={name}
          id={name}
          disabled={disabled}
          maxLength={maxLength}
        />
        {rightIcon && <span className="input_right_icon">{rightIcon}</span>}
      </div>
      {error && touched && <Error>{error}</Error>}
    </div>
  );
};

export default Input;
