import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PageHeading from "components/common/PageHeading/PageHeading";
import { Col, Container, Row } from "react-bootstrap";
import "./CreateProjets.scss";
import { FieldArray, FormikHelpers, FormikProvider, useFormik } from "formik";
import Input from "components/common/form/Input/Input";
import Select from "components/common/form/Select/Select";
import Button from "components/common/Button/Button";
import { DeleteIcon } from "assets/images/Svgicons";
import { ROUTES, VALIDATION_MESSAGES, Yup } from "utils/constants";
import {
  useCreateProjectMutation,
  useGetEnabledProjectsQuery,
  useGetProjectByIdMutation,
  useGetProjectsQuery,
  // useUpdateProjectMutation,
} from "services/projects";
import { useGetRolesQuery, useGetUsersMutation } from "services/users";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface DropdownType {
  value: string;
  label: string;
}

interface CreateProjectValues {
  projectName: any;
  budget: string;
  totalEstimationHours: string;
  hourlyRate: string;
  teamItems: any;
  reportingCode: string;
  status: string;
  saleType: string;
}

const CreateProjets = () => {
  const page = 1;
  const blankTeamItem = {
    id: new Date().getTime() + Math.random(),
    jobRole: "",
    empOptions: [],
    empName: "",
    empId: "",
    allocatedHours: "",
  };
  console.log("teamItems", blankTeamItem);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);
  const params = useParams();

  const isEdit = Boolean(location.pathname.includes(ROUTES.EDIT_PROJECT));
  const [initialTeamItems, setInitialTeamItems] = useState([blankTeamItem]);

  const [
    getProjectById,
    { data: projectDetail, isSuccess: projectDetailFetched },
  ] = useGetProjectByIdMutation();

  useEffect(() => {
    if (projectDetail?.data?.employees) {
      console.log("projectDetail", projectDetail.data.employees);
      const backendTeamItems = projectDetail.data.employees.map(
        (item: any) => ({
          id: new Date().getTime() + Math.random(),
          jobRole: { value: item.roleId, label: item.roleName },
          empOptions: item.empOptions, //missing
          empName: { value: item.empID, label: item.empName },
          empId: item.empID,
          allocatedHours: item.allocatedHours,
        })
      );

      // setInitialTeamItems([blankTeamItem, ...backendTeamItems]);
      console.log("fyhtdgrsfeadfd", backendTeamItems);

      formik.setFieldValue("teamItems", backendTeamItems);
    }
  }, [projectDetail]);

  // State
  const [selectedProject, setSelectedProject] = useState<any>({});

  //API
  const { data: enabledProjectsData, isLoading: enabledProjectsLoading } =
    useGetEnabledProjectsQuery({ page });
  const { data: allProjectsData, isLoading: allProjectsLoading } =
    useGetProjectsQuery({ page });

  const projectsData = isEdit ? allProjectsData : enabledProjectsData;
  console.log("projectData", projectsData);
  const { data: rolesData, isSuccess: rolesFetched } = useGetRolesQuery({
    page,
  });
  const [getUsersByRole, { data: usersData, isSuccess: usersFetched }] =
    useGetUsersMutation();
  const [createProject, { isSuccess: createProjectSuccess }] =
    useCreateProjectMutation();

  useEffect(() => {
    const fetchProjectDetail = async () => {
      await getProjectById({ idOfProject: params.id });
    };

    if (isEdit) {
      fetchProjectDetail();
    }
  }, [getProjectById, params.id, isEdit]);

  const projectsOptions = useMemo(() => {
    return projectsData?.map((r: any) => {
      return {
        label: r.projectName,
        value: r.projectId,
      };
    });
  }, [projectsData]);

  const rolesOptions = useMemo(() => {
    return rolesData?.rows?.map((r: any) => {
      return {
        value: r.id,
        label: r.role,
      };
    });
  }, [rolesData]);

  // Formik
  const initialValues = {
    // enableReinitialize: true,
    projectName: "",
    reportingCode: "",
    status: "",
    saleType: "",
    hourlyRate: "",
    totalEstimationHours: "",
    budget: "",
    teamItems: initialTeamItems,
  };

  const dropdownObjectValidation = Yup.object({
    value: Yup.string().required(VALIDATION_MESSAGES.SELECT_REQUIRED),
    label: Yup.string().required("Required"),
  });

  const validationSchema = Yup.object({
    projectName: dropdownObjectValidation.required("Required"),
    reportingCode: Yup.string().required("Required"),
    status: Yup.string().required("Required"),
    saleType: Yup.string().required("Required"),
    hourlyRate: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .typeError(VALIDATION_MESSAGES.MUST_BE_NUMBER)
      .min(1, VALIDATION_MESSAGES.GREATER_THAN_ZERO)
      .max(99999, VALIDATION_MESSAGES.MAXIMUM_5_DIGITS)
      .required(VALIDATION_MESSAGES.REQUIRED("hourly rate")),
    budget: Yup.number()
      .typeError(VALIDATION_MESSAGES.MUST_BE_NUMBER)
      .integer(VALIDATION_MESSAGES.MUST_BE_INTEGER)
      .min(1, VALIDATION_MESSAGES.GREATER_THAN_ZERO)
      .max(9999999999, VALIDATION_MESSAGES.MAXIMUM_10_DIGITS)
      .required(VALIDATION_MESSAGES.REQUIRED("budget")),
    totalEstimationHours: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .typeError(VALIDATION_MESSAGES.MUST_BE_NUMBER)
      .min(1, VALIDATION_MESSAGES.GREATER_THAN_ZERO)
      .max(9999999999, VALIDATION_MESSAGES.MAXIMUM_10_DIGITS)
      .required(VALIDATION_MESSAGES.REQUIRED("total estimation hours")),

    // Team Validations
    teamItems: Yup.array().of(
      Yup.object({
        jobRole: dropdownObjectValidation.required("Required"),
        empName: dropdownObjectValidation.required("Required"),
        // empId: dropdownObjectValidation.required("Required"),
        allocatedHours: Yup.string()
          .matches(/^\d+$/, "Only numbers are allowed")
          .typeError(VALIDATION_MESSAGES.MUST_BE_NUMBER)
          .min(1, VALIDATION_MESSAGES.GREATER_THAN_ZERO)
          .max(9999999999, VALIDATION_MESSAGES.MAXIMUM_10_DIGITS)
          .required(VALIDATION_MESSAGES.REQUIRED("allocated hours")),
      })
    ),
  });

  const formSubmitHandler = async (
    values: CreateProjectValues,
    action: FormikHelpers<CreateProjectValues>
  ) => {
    try {
      action.setSubmitting(true);
      const {
        projectName,
        totalEstimationHours,
        budget,
        hourlyRate,
        teamItems,
      } = values;

      const data = {
        projectId: projectName?.value,
        totalEstimatedHours: totalEstimationHours,
        budget: budget,
        hourlyRate,
        employeeHours: teamItems?.map((t: any) => {
          return {
            employeeId: t.empName?.value,
            allocatedHours: t.allocatedHours,
          };
        }),
      };

      const res = await createProject(data).unwrap();
      if (res && res?.error === false) {
        toast.success(res?.message);
        setRedirect(true);
        // navigate(ROUTES.PROJECTS);
      } else {
        throw res;
      }
    } catch (error) {
    } finally {
      action.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (redirect) {
      navigate(ROUTES.PROJECTS);
    }
  }, [redirect, navigate]);

  const formik = useFormik<typeof initialValues>({
    initialValues,
    validationSchema,
    onSubmit: formSubmitHandler,
    enableReinitialize: true,
  });

  const jobRoleSelectHandler = async (
    selectedRole: DropdownType,
    idx: number
  ) => {
    try {
      const data = {
        roleId: selectedRole?.value,
      };
      const res = await getUsersByRole(data).unwrap();
      if (res && res?.error === false) {
        let rData = [res?.data?.rows];
        const resData = res?.data?.rows?.map((r: any) => {
          const udata = {
            label: `${r.name} (${r.employeeCode})`,
            value: r.employeeId,
          };
          console.log(r, udata, "resData rrrrrrrrrrrrrrrrrrrrrr");
          return udata;
        });

        console.log("resData", resData, res);
        formik.setFieldValue(`teamItems[${idx}].empOptions`, resData);
      } else {
        throw res;
      }
    } catch (error) {}
  };
  console.log("FOOO", formik.values);

  // Autofill project details in form
  const prevProjectDetailRef: any = useRef(null);

  const updateInitialProjectDetail = useCallback(() => {
    if (isEdit && projectsData) {
      const initialProjectDetail = projectsData
        .filter((r: any) => r.projectId === params.id)
        .map((r: any) => ({ label: r.projectName, value: r.projectId }))[0];

      if (
        initialProjectDetail &&
        (!prevProjectDetailRef.current ||
          initialProjectDetail.label !== prevProjectDetailRef.current.label ||
          initialProjectDetail.value !== prevProjectDetailRef.current.value)
      ) {
        setSelectedProject(
          projectsData.find((r: any) => r.projectId === params.id)
        );

        formik.setFieldValue("projectName", initialProjectDetail);
        prevProjectDetailRef.current = initialProjectDetail;
      }
    }
  }, [isEdit, projectsData, params.id, formik]);

  useEffect(() => {
    updateInitialProjectDetail();
  }, [updateInitialProjectDetail]);

  useEffect(() => {
    console.log("selectedProject", selectedProject);
    // if (isEdit) {
    formik.setFieldValue(
      "budget",
      selectedProject?.budget ? selectedProject.budget : ""
    );
    formik.setFieldValue(
      "totalEstimationHours",
      selectedProject?.totalEstimatedHours
        ? selectedProject?.totalEstimatedHours
        : ""
    );
    formik.setFieldValue(
      "hourlyRate",
      selectedProject?.hourlyRate ? selectedProject?.hourlyRate : ""
    );
    formik.setFieldValue("reportingCode", selectedProject?.reportingCode);
    formik.setFieldValue("status", selectedProject?.status);
    formik.setFieldValue("saleType", selectedProject?.typeOfSale);
  }, [selectedProject]);

  const getPendingEmployeeName = (idx: any) => {
    let allEmp: any = [...formik.values.teamItems];
    // return allEmp[idx]?.empOptions;
    console.log("ALL emp", allEmp);
    let selectedEmp: any = [...formik.values.teamItems];
    for (let i = 0; i < allEmp.length; i++) {
      for (let j = 0; j < selectedEmp.length; j++) {
        for (let k = 0; k < allEmp[i]?.empOptions?.length; k++) {
          if (allEmp[i]?.empOptions[k]?.value == selectedEmp[j]?.empId) {
            selectedEmp[i].empOptions.splice(k, 1);
          }
        }
      }
    }

    return selectedEmp[idx]?.empOptions;
  };

  return (
    <section className="create_projects">
      <Container>
        <div className="card_in">
          <PageHeading
            title={`${isEdit ? "Edit" : "Create"} project`}
            // subTitle="These are the daily reports of new create projects"
          />

          <div className="projects_filter">
            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit}>
                {/* Project Info */}
                <Row>
                  {/* Project Name */}
                  <Col sm={4} lg={2} xl>
                    <Select
                      label="Project Name"
                      options={projectsOptions}
                      placeholder="Select..."
                      className="select_project"
                      {...formik.getFieldProps("projectName")}
                      formik={formik}
                      value={formik.values.projectName}
                      isDisabled={isEdit}
                      onChangeCallback={(selectedItem) => {
                        formik.setFieldValue("projectName", selectedItem);
                        const selectedProjectDetail = projectsData?.find(
                          (p: any) => p.projectId === selectedItem?.value
                        );

                        setSelectedProject(selectedProjectDetail);
                      }}
                    />
                  </Col>

                  {/* Reporting Code */}
                  <Col sm={4} lg={2} xl>
                    <Input
                      name="reportingCode"
                      label="Reporting Code"
                      placeholder="Reporting Code"
                      disabled={true}
                      value={formik?.values?.reportingCode}
                    />
                  </Col>

                  {/* Status */}
                  <Col sm={4} lg={2} xl>
                    <Input
                      label="Status"
                      placeholder="Status"
                      name="status"
                      disabled={true}
                      value={formik?.values?.status}
                    />
                  </Col>

                  <Col sm={4} lg={2} xl>
                    <Input
                      label="Sale Type"
                      placeholder="Sale Type"
                      disabled={true}
                      name="saleType"
                      value={formik?.values?.saleType}
                    />
                  </Col>

                  <Col sm={4} lg={2} xl>
                    <Input
                      label="Hourly Rate"
                      placeholder="Enter hourly rate"
                      type="text"
                      formik={formik}
                      {...formik.getFieldProps("hourlyRate")}
                    />
                  </Col>

                  <Col sm={4} lg={2} xl>
                    <Input
                      label="Budget"
                      type="number"
                      placeholder="Enter budget"
                      formik={formik}
                      disabled={selectedProject?.budget ? true : false}
                      {...formik.getFieldProps("budget")}
                      value={formik?.values.budget}
                    />
                  </Col>

                  <Col sm={4} lg={2} xl>
                    <Input
                      label="Total Estimation Hours"
                      placeholder="Enter total estimation hours"
                      type="text"
                      {...formik.getFieldProps("totalEstimationHours")}
                      formik={formik}
                    />
                  </Col>
                </Row>

                <Row>
                  
                    {/* Team Info */}
                <FieldArray
                  name="teamItems"
                  render={(arrayHelpers) => {
                    return formik.values?.teamItems?.map((i, idx) => {
                      return (
                        <Col md={6} key={i.id}>
                        <div className="team_project">
                          <div className="team_project_inner">
                          {/* Job Role */}
                          <div>
                            <Select
                              label="Job Role"
                              options={rolesOptions}
                              placeholder="Select..."
                              className="select_project"
                              {...formik.getFieldProps(
                                `teamItems[${idx}].jobRole`
                              )}
                              formik={formik}
                              onChangeCallback={(
                                selectedRole: DropdownType
                              ) => {
                                jobRoleSelectHandler(selectedRole, idx);
                                formik.setFieldValue(
                                  `teamItems[${idx}].empName`,
                                  ""
                                );
                                formik.setFieldValue(
                                  `teamItems[${idx}].empId`,
                                  ""
                                );
                              }}
                              // isDisabled={(isEdit && formik.values.teamItems[idx]?.empId) ? true : false}
                              isDisabled={
                                isEdit &&
                                idx < projectDetail?.data?.employees.length
                              }
                            />
                          </div>

                          {/* Employee Name */}
                          <div>
                            <Select
                              label="Employee Name"
                              options={getPendingEmployeeName(idx)}
                              placeholder="Select..."
                              className="select_project"
                              {...formik.getFieldProps(
                                `teamItems[${idx}].empName`
                              )}
                              formik={formik}
                              onChangeCallback={(selectedItem) => {
                                formik.setFieldValue(
                                  `teamItems[${idx}].empId`,
                                  selectedItem?.value
                                );
                              }}
                              isDisabled={
                                isEdit &&
                                idx < projectDetail?.data?.employees.length
                              }
                              // isDisabled={(isEdit && formik.values.teamItems[idx]?.empName) ? true : false}
                            />
                          </div>

                          <div>
                            <Input
                              label="Allocated Hours"
                              placeholder="Enter allocated hours"
                              type="text"
                              {...formik.getFieldProps(
                                `teamItems[${idx}].allocatedHours`
                              )}
                              formik={formik}
                            />
                          </div>

                          {(idx >= projectDetail?.data?.employees.length ||
                            (idx > 0 && !isEdit)) && (
                            <div
                              className="delete_icon"
                              onClick={() => arrayHelpers.remove(idx)}
                            >
                              <DeleteIcon />
                            </div>
                          )}
                          </div>
                        </div>
                        </Col>
                      );
                    });
                  }}
                />

                 
                </Row>

                
                <div className="create_btns">
                  <Button
                    type="button"
                    onClick={() => {
                      const currentTeamItems = formik.values.teamItems;
                      const newTeamItems = [...currentTeamItems, blankTeamItem];
                      formik.setFieldValue("teamItems", newTeamItems);
                    }}
                  >
                    + Add New Employee
                  </Button>
                  <Button
                    type="submit"
                    className="create"
                    disabled={formik.isSubmitting || !formik.isValid}
                  >
                    {isEdit ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </FormikProvider>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CreateProjets;
