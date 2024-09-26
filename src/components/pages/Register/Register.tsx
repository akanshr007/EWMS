import { useFormik } from "formik";
import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import {
  Email,
  EmployeeIcon,
  LockIcon,
  UserIcon,
} from "../../../assets/icons/icons";
import logo from "../../../assets/logos/antier-logo.webp";
import { ROUTES, Yup } from "../../../utils/constants";
import Button from "../../common/Button/Button";
import Input from "../../common/form/Input/Input";
import Password from "../../common/form/Password/Password";
import Phone from "../../common/form/Phone/Phone";
import Select from "../../common/form/Select/Select";
import { Col, Row } from "react-bootstrap";

const Register = () => {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    employee_id: "",
    email: "",
    phone: "",
    job: "",
    password: "",
    confirm_password: "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required().label("Name"),
    employee_id: Yup.string().required().label("Employee Id"),
    phone: Yup.string().required().label("Phone"),
    job: Yup.string().required().label("Job"),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(8).label("Password"),
    confirm_password: Yup.string()
      .required()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .label("Confirm Password"),
  });
  const options = [
    { value: "TPM", label: "TPM" },
    { value: "TL", label: "TL" },
    { value: "QA", label: "QA" },
    { value: "DEVOPS", label: "DEVOPS" },
    { value: "DEVELOPER", label: "DEVELOPER" },
    { value: "BA", label: "BA" },
    { value: "UI/UX", label: "UI/UX" },
    { value: "PM", label: "PM" },
  ];
  const formik = useFormik<typeof initialValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // navigate(ROUTES.ROOT);
      navigate(ROUTES.ROOT, { replace: true });
    },
  });
  return (
    <div className="onboard_card register_card">
      <img src={logo} className="onboard_logo" alt="logo" />
      <h2>Register</h2>
      <p className="sub_txt">Sign up to access your personalized dashboard.</p>
      <form onSubmit={formik.handleSubmit}>
        {/* <Row>
          <Col sm={6}>
            <Input
              label="Name"
              placeholder="Enter your name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.name}
              value={formik.values.name}
              className="form_input"
              icon={<UserIcon />}
            />
          </Col>
          <Col sm={6}>
            <Input
              label="Employee Id"
              placeholder="Enter employee id"
              name="employee_id"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.employee_id}
              value={formik.values.employee_id}
              className="form_input"
              icon={<EmployeeIcon />}
            />
          </Col>
          <Col md={12}>
            <Input
              label="Email"
              placeholder="Enter your email address"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.email}
              value={formik.values.email}
              className="form_input"
              icon={<Email />}
            />
          </Col>
          <Col sm={6}>
            <Select
              label="Job Role"
              placeholder="Select job role"
              name="job"
              onChange={(option: any) => {
                formik.setFieldValue("job", option.value);
              }}
              error={formik.errors.job}
              className="form_input"
              options={options}
            />
          </Col>
          <Col sm={6}>
            <Phone
              label="Phone"
              placeholder="Enter your phone number"
              onChange={(phone) => formik.setFieldValue("phone", phone)}
              error={formik.errors.phone}
              value={formik.values.phone}
              className="form_input"
            />
          </Col>
          <Col sm={6}>
            <Password
              label="Password"
              placeholder="••••••••••"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              value={formik.values.password}
              icon={<LockIcon />}
              className="form_input"
            />
          </Col>
          <Col sm={6}>
            <Password
              label="Confirm Password"
              placeholder="••••••••••"
              name="confirm_password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirm_password}
              value={formik.values.confirm_password}
              icon={<LockIcon />}
            />
          </Col>
        </Row> */}
        <Button
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
          className="submit_btn"
          loading={formik.isSubmitting}
          fluid
        >
          Submit
        </Button>
        <p className="sign_up_txt">
          Already have an account? <Link to={ROUTES.ROOT}>Sign in here.</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
