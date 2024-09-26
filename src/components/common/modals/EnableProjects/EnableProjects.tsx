import Modal from "../Modal/Modal";
import { FormikHelpers, useFormik } from "formik";
import Input from "components/common/form/Input/Input";
import Button from "components/common/Button/Button";
import { Col, Row } from "react-bootstrap";
import Select from "components/common/form/Select/Select";
import {
  useEnableProjectMutation,
  useGetProjectSaleTypeQuery,
} from "services/projects";
import { useEffect, useState } from "react";
import { useGetRolesQuery, useGetUsersMutation } from "services/users";
import { REGEX, VALIDATION_MESSAGES, Yup } from "utils/constants";
import toast from "react-hot-toast";
import { isNumber } from "utils/helpers";
import './EnableProjects.scss';
type PropTypes = {
  show?: boolean;
  handleClose: () => void;
  onSuccess: () => void; // Add onSuccess prop
};

interface DropdownType {
  value: string;
  label: string;
}

interface EnableFormValues {
  projectName: string;
  reportingCode: string;
  saleType: DropdownType;
  projectManager: DropdownType;
  budget: string;
}

const EnableProjects = (props: PropTypes) => {
  const page = 1;

  // States
  const [managersList, setManagersList] = useState([]);
  const [saleTypeOptions, setSaleTypeOptions] = useState([]);

  // API
  const { data: rolesData, isSuccess: rolesFetched } = useGetRolesQuery({
    page,
  });
  const [getUsers, { isLoading: usersLoading }] = useGetUsersMutation();
  const { data: saleTypesData, isSuccess: saleTypesFetched } =
    useGetProjectSaleTypeQuery({ page });
  const [enableProject, { isLoading }] = useEnableProjectMutation();

  // Submit Form and Enable Project
  const formSubmitHandler = async (
    values: EnableFormValues,
    action: FormikHelpers<EnableFormValues>
  ) => {
    try {
      action.setSubmitting(true);

      const data = {
        projectName: values.projectName,
        reportingCode: values.reportingCode,
        saleType: values.saleType.value,
        managerId: values.projectManager.value,
        budget: values.budget,
      };

      const res = await enableProject(data).unwrap();
      if (res && res?.error === false) {
        toast.success(res?.message);
        props.handleClose();
        props.onSuccess(); // Call onSuccess callback
      } else {
        throw res;
      }
    } catch (error) {
      console.error("🚀 ~ EnableProjects ~ error:", error);
    } finally {
      action.setSubmitting(false);
    }
  };

  const dropdownInitialValues = {
    label: "",
    value: "",
  };

  // Formik
  const initialValues = {
    projectName: "",
    reportingCode: "",
    saleType: dropdownInitialValues,
    projectManager: dropdownInitialValues,
    budget: "",
  };

  const dropdownObjectValidation = Yup.object({
    value: Yup.string().required(VALIDATION_MESSAGES.SELECT_REQUIRED),
    label: Yup.string().required("Required"),
  });

  const validationSchema = Yup.object({
    projectName: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED("project name"))
      .matches(REGEX.PPROJECT_NAME, VALIDATION_MESSAGES.WRONG_PROJECT_NAME)
      .label("Project Name"),
    reportingCode: Yup.string()
      .required(VALIDATION_MESSAGES.REQUIRED("reporting code"))
      .matches(REGEX.REPORTING_CODE, VALIDATION_MESSAGES.WRONG_REPORTING_CODE)
      .label("Reporting Code"),
    saleType: dropdownObjectValidation
      .required(VALIDATION_MESSAGES.REQUIRED("sale type"))
      .label("Sale Type"),
    projectManager: dropdownObjectValidation
      .required(VALIDATION_MESSAGES.REQUIRED("project manager"))
      .label("Project Manager"),
    budget: Yup.string()
      // .required(VALIDATION_MESSAGES.REQUIRED("budget"))
      .label("Budget"),
  });

  const formik = useFormik<typeof initialValues>({
    initialValues,
    validationSchema,
    onSubmit: formSubmitHandler,
  });

  const getManagers = async (pmId: string) => {
    try {
      const data = {
        roleId: pmId,
      };
      const res = await getUsers(data).unwrap();
      if (res && res?.error === false) {
        const data = res?.data;

        // Set managers list
        const list = data?.rows?.map((d: any) => {
          return {
            label: d.name,
            value: d.employeeId,
          };
        });
        setManagersList(list);
      } else {
        throw res;
      }
    } catch (error) {
      console.error("🚀 ~ getMangers ~ error:", error);
    }
  };

  useEffect(() => {
    if (rolesFetched && rolesData && rolesData.rows?.length > 0) {
      // get PM role ID
      const pmRole = rolesData.rows.find((item: any) => item.role === "PM");
      getManagers(pmRole?.id);
    }
  }, [rolesFetched, rolesData]);

  useEffect(() => {
    if (saleTypesFetched && saleTypesData && saleTypesData.rows?.length > 0) {
      // Set Sale Type Options
      const saleTypeOptionsFormat = saleTypesData.rows?.map((i: any) => {
        return {
          label: i.saleType,
          value: i.id,
        };
      });

      setSaleTypeOptions(saleTypeOptionsFormat);
    }
  }, [saleTypesFetched, saleTypesData]);

  return (
    <Modal show={props.show} onHide={props.handleClose} title="Add Project">
      <form onSubmit={formik.handleSubmit}>
        <Row className="align-item-end">
          <Col sm={4}>
            <Input
              label="Project Name"
              placeholder="Project name"
              formik={formik}
              {...formik.getFieldProps("projectName")}
            />
          </Col>
          <Col sm={4}>
            <Input
              label="Reporting Code"
              placeholder="ABCD000"
              formik={formik}
              {...formik.getFieldProps("reportingCode")}
            />
          </Col>
          <Col sm={4}>
            <Select
              label="Sale Type"
              options={saleTypeOptions}
              placeholder="Select..."
              className="select_project"
              formik={formik}
              {...formik.getFieldProps("saleType")}
            />
          </Col>
          <Col sm={4}>
            <Select
              label="Project Manager"
              options={managersList}
              placeholder="Project"
              className="select_project"
              formik={formik}
              {...formik.getFieldProps("projectManager")}
            />
          </Col>
          <Col sm={4}>
            <Input
              label="Budget"
              type="text"
              onKeyDown={(evt) => isNumber(evt) && evt.preventDefault()}
              maxLength={15}
              placeholder="Enter project budget"
              formik={formik}
              {...formik.getFieldProps("budget")}
            />
          </Col>
          <Col sm={4}>
          <div className="submit_btn">
          <Button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            loading={formik.isSubmitting}
          >
            Add
          </Button>
        </div>
          </Col>
        </Row>        
      </form>
    </Modal>
  );
};

export default EnableProjects;
