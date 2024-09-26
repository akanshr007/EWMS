import { ButtonHTMLAttributes } from "react";
import { Spinner } from "react-bootstrap";
import "./Button.scss";
import { isDisabled } from "@testing-library/user-event/dist/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fluid?: boolean;
  loading?: boolean;
  text?: string;
};

const Button = (props: ButtonProps) => {
  const { loading, fluid, children, text, className, ...rest } = props;
  return (
    <button
      {...rest}
      className={`custom_btn ${fluid ? "w-100" : ""} ${className || ""}`}
    >
      {loading ? <Spinner /> : text || children}
    </button>

  );
};

export default Button;
