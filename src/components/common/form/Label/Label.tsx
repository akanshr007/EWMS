import { LabelHTMLAttributes } from "react";
import "./Label.scss";

type propTypes = LabelHTMLAttributes<HTMLLabelElement> & {};

const Label = (props: propTypes) => {
  const { className, ...rest } = props;
  return (
    <>
      <label {...rest} className={`${className || ""} custom_label`}>
        {props.children}
      </label>
    </>
  );
};

export default Label;
