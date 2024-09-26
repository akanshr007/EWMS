import { useFormik } from "formik";
import Modal from "../Modal/Modal";
import "./AddReports.scss";
import Button from "../../Button/Button";
import Input from "../../form/Input/Input";

type PropTypes = {
  show?: boolean;
  handleClose?: () => void;
};

const AddReports = (props: PropTypes) => {
  // Formik
  const initialValues = {
    projectName: "",
    employeeId: "",
    employeeName: "",
    jobRole: "",
    date: "",
    logHours: "",
    remarks: "",
  };
  const formik = useFormik<typeof initialValues>({
    initialValues,
    onSubmit: (values) => {},
  });
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      title="Add Project"
      className="add_report"
    >
      <form onSubmit={formik.handleSubmit}>
        <Input
          name="projectName"
          label="Project Name"
          placeholder="Enter project name"
          value={formik.values.projectName}
          error={formik.errors.projectName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div className="submit_btn">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddReports;
