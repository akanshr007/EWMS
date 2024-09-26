import PhoneInput from "react-phone-input-2";
import "./Phone.scss";
import Label from "../Label/Label";
import Error from "../Error/Error";

type propTypes = {
  className?: string;
  label?: string;
  error?: string;
  value?: string;
  onChange?: (phone: string) => void;
  placeholder?: string;
  onBlur?: () => void;
};

const Phone = (props: propTypes) => {
  const { className, value, error, onChange, label, ...rest } = props;
  return (
    <div className={`phone_input ${className || ""}`}>
      {label && <Label>{label}</Label>}
      <PhoneInput {...rest} country={"us"} value={value} onChange={onChange} />
      {error && <Error>{error}</Error>}
    </div>
  );
};

export default Phone;
