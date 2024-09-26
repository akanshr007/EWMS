import ReactSelect, { Props } from "react-select";
import Error from "../Error/Error";
import Label from "../Label/Label";
import "./Select.scss";
import { FormikBag, FormikProps, FormikValues, getIn } from "formik";

export type Option = {
  value: string;
  label: string;
  hours?: number; // Optional hours property
};

type propTypes<T> = Props & {
  name: string;
  label?: string;
  error?: string;
  defaultValue?: any;
  onChangeCallback?: (arg: Option) => void;
  formik: FormikProps<T>;
};

const Select = <T extends FormikValues>({
  className,
  label,
  name,
  value,
  defaultValue,
  onChangeCallback,
  ...rest
}: propTypes<T>) => {
  const { formik } = rest;

  // Errors and Touched
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);
  return (
    <div className={`${className || ""} custom_select`}>
      {label && <Label>{label}</Label>}
      <div className="select_in">
        <ReactSelect
          // value={name && formik && formik.values[name]}
          value={value}
          defaultValue={defaultValue}
          classNamePrefix={"select"}
          className="select"
          {...rest}
          onChange={(selectedValue) => {
            console.log("SELECTED", selectedValue);
            name && formik?.setFieldValue(name, selectedValue);
            onChangeCallback && onChangeCallback(selectedValue);
          }}
          onBlur={() => name && formik?.setFieldTouched(name, true)}
          // menuIsOpen
        />
      </div>
      {error?.value && touched && <Error>{error?.value}</Error>}
    </div>
  );
};

export default Select;
