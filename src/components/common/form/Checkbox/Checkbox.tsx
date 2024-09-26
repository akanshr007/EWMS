import React, { InputHTMLAttributes } from "react";
import Label from "../Label/Label";
import "./Checkbox.scss";
import Error from "../Error/Error";
import { FormikProps, FormikValues } from "formik";

type propTypes<T> = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  error?: string;
  onChangeCallback?: (arg: any) => void;
  formik?: FormikProps<T>;
};

const Checkbox = <T extends FormikValues>(props: propTypes<T>) => {
  const {
    className,
    error,
    name,
    formik,
    label,
    disabled,
    checked,
    onChangeCallback,
    ...rest
  } = props;

  return (
    <div className={`custom_checkbox ${className || ""}`}>
      <div className="checkbox_in">
        <input
          {...rest}
          name={name}
          id={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            const isChecked = e.target.checked;

            name && formik?.setFieldValue(name, isChecked);
            onChangeCallback && onChangeCallback(isChecked);
          }}
        />
        {label && <Label htmlFor={name}>{label}</Label>}
      </div>
      {error && <Error>{error}</Error>}
    </div>
  );
};

export default Checkbox;
