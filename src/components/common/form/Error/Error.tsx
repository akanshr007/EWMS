import { ReactNode } from "react";
import "./Error.scss";

const Error = (props: { children?: ReactNode; className?: string }) => {
  return (
    <p className={`${props.className || ""} error_msg`}>{props.children}</p>
  );
};

export default Error;
