import PageHeading from "components/common/PageHeading/PageHeading";
import { Col, Container, Row } from "react-bootstrap";
import "./AddReport.scss";
import { FormikProvider, useFormik } from "formik";
import Input from "components/common/form/Input/Input";
import Select from "components/common/form/Select/Select";
import Button from "components/common/Button/Button";
import { ROUTES, VALIDATION_MESSAGES, WEEK_DAYS, Yup } from "utils/constants";
import Label from "components/common/form/Label/Label";
import WeekSelector, {
  getWeekDays,
} from "components/common/WeekSelector/WeekSelector";
import {
  format,
  isBefore,
  isFuture,
  isToday,
  setHours,
  setMinutes,
} from "date-fns";
import { useSelector } from "react-redux";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Error from "components/common/form/Error/Error";
import { useGetUsersMutation, useGetPmUsersQuery } from "services/users";
import { getDropdownOptions, isNumber, transformData } from "utils/helpers";
import {
  useGetAssignedProjectsMutation,
  useGetLeavesQuery,
} from "services/projects";
import { useLogHoursMutation } from "services/logHours";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Define the type for the date totals
interface DateTotals {
  [date: string]: number;
}

const AddReport = () => {
  const currentWeekDates = getWeekDays(new Date());
  const [redirect, setRedirect] = useState(false);
  console.log("DATE", currentWeekDates);
  const sixThirtyPM = setMinutes(setHours(new Date(), 18), 30);

  // Hooks
  const navigate = useNavigate();

  // State
  const [empName, setEmpName] = useState({ label: "", value: "" });
  const [jobRole, setJobRole] = useState("");

  const userData = useSelector((state: any) => state.user.userData);
  console.log("userData", userData);
  const isOtherThanPM = userData?.roleType !== "PM";
  // API's
  const { data: pmUsers, isSuccess: isPmUserFetched } = useGetPmUsersQuery(
    {},
    {
      skip: isOtherThanPM,
    }
  );

  console.log("usersDataPm", pmUsers);

  const [
    getAssignedProjects,
    {
      data: assignedProjects,

      isLoading: projectsFetching,
      isSuccess: projectsFetched,
    },
  ] = useGetAssignedProjectsMutation();

  const { data: leavesData, isLoading: leavesFetched } = useGetLeavesQuery({});
  console.log("leavesData", leavesData);

  const [
    logHours,
    {
      data: loggedHoursData,
      isSuccess: loggedHoursSucces,
      isLoading: loggedHoursLoading,
    },
  ] = useLogHoursMutation();
  console.log("assignedProjects", assignedProjects?.data);

  const leavesOptions = [
    {
      value: "",
      label: "Select...",
      hours: "", // Assuming 0 hours for the "Select leave" option
    },
    ...(leavesData?.map((leave: any) => ({
      value: leave.leaveId,
      label: `${leave.leaveType} - ${leave.leaveId} (${leave.hours} hours)`,
      hours: leave.hours,
    })) || []),
  ];

  const employeesOptions = useMemo(() => {
    if (isPmUserFetched && pmUsers?.length > 0) {
      const options = pmUsers?.map((e: any) => {
        const { employeeCode, employeeId, name } = e || {};
        const optionValue = getDropdownOptions(
          `${name} (${employeeCode})`,
          employeeId
        );
        return optionValue;
      });

      return options;
    }
  }, [pmUsers, isPmUserFetched]);

  const getUserValue = useCallback(
    (userData: any) => {
      return {
        label: `${userData?.fullName} (${userData?.employeeCode})`,
        value: userData?.empId,
      };
    },
    [userData]
  );

  // Formik

  const initialProjects =
    assignedProjects?.data?.projectData?.map((project: any) => ({
      projectName: project.name,
      projectId: project.project_id,
      reportingCode: project.reportingCode || "",
      remainingHours: project.remainingHours || 0,
      areExtraHours: false,
      dates: currentWeekDates?.map((d, index) => {
        const isDisabled =
          isFuture(d.date) ||
          (isToday(d.date) && isBefore(new Date(), sixThirtyPM));
        return {
          hours: project?.dailyLog[index]?.logged_hours || "",
          date: d.formattedDate,
          extraHours: project?.dailyLog[index]?.extra_hours || "",
          isDisabled: isDisabled,
        };
      }),
    })) || [];

  const getLeaveFormat = () => {
    let final: any = [];
    console.log("Leaves", assignedProjects?.data?.leave);
    assignedProjects?.data?.leave.forEach((element: any) => {
      if (element.leaveId) {
        final.push({
          date: element.leaveDate,
          label: `${element.leaveType} - ${element.leaveId} (${element.hours} hours)`,
          value: element.leaveId,
          hours: element.hours, // ISSUE IS HERE HOURS IS MISSING IN API
        });
      } else {
        final.push({
          date: "",
          label: "Select...",
          value: "",
          hours: "",
        });
      }
    });
    return final;
  };
  console.log("initialProjects", initialProjects);

  const initialValues = {
    employeeName: isOtherThanPM
      ? getUserValue(userData)
      : empName?.label
      ? empName
      : "",
    jobRole: isOtherThanPM ? userData?.roleType : jobRole,
    projectsData: initialProjects,
    leaves: getLeaveFormat(),
  };

  const dropdownObjectValidation = Yup.object({
    value: Yup.string().required(VALIDATION_MESSAGES.SELECT_REQUIRED),
    label: Yup.string().required("Required"),
  });

  const validationSchema = Yup.object({
    employeeName: dropdownObjectValidation,
    projectsData: Yup.array()
      .of(
        Yup.object().shape({
          areExtraHours: Yup.boolean(),
          dates: Yup.array().of(
            Yup.object({
              isDisabled: Yup.boolean(),
              date: Yup.string().required("Date is required"), // Ensure the date field exists
              hours: Yup.number()
                .typeError(VALIDATION_MESSAGES.MUST_BE_NUMBER)
                .integer(VALIDATION_MESSAGES.MUST_BE_INTEGER)
                .min(1, VALIDATION_MESSAGES.GREATER_THAN_ZERO)
                .max(8, VALIDATION_MESSAGES.MAXIMUM_8_HOURS),
            })
          ),
        })
      )
      .test(
        "total-hours-exact-per-day",
        "Total hours for any day must be exactly 8 (including leave hours)",
        function (projectsData) {
          const { leaves } = this.parent; // Access leave data
          const totalHoursPerDay: any = {}; // Object to store total hours per day

          // Calculate total hours per day across all projects
          if (projectsData) {
            projectsData.forEach((project: any) => {
              project.dates.forEach((date: any) => {
                const dayKey = date.date; // Unique identifier for each day

                if (!totalHoursPerDay[dayKey]) {
                  totalHoursPerDay[dayKey] = 0;
                }

                totalHoursPerDay[dayKey] += parseFloat(date.hours || 0); // Sum up the hours
              });
            });
          }

          // Add leave hours to the corresponding days
          if (leaves) {
            leaves.forEach((leave: any) => {
              if (leave.date && leave.hours) {
                totalHoursPerDay[leave.date] =
                  (totalHoursPerDay[leave.date] || 0) + parseFloat(leave.hours);
              }
            });
          }

          // Validate that total hours are exactly 8 per day if any hours are filled
          for (const day in totalHoursPerDay) {
            if (totalHoursPerDay[day] > 8) {
              return this.createError({
                path: `projectsData`, // Provide a general error path
                message: `Total hours for ${day} exceed 8 hours.`,
              });
            }

            if (totalHoursPerDay[day] > 0 && totalHoursPerDay[day] !== 8) {
              return this.createError({
                path: `projectsData`, // Provide a general error path
                message: `Total hours for ${day} must be exactly 8 hours.`,
              });
            }
          }

          return true; // Validation passes if each day has exactly 8 hours or is empty
        }
      ),
  });

  const formSubmitHandler = async (values: any, action: any) => {
    try {
      console.log("values", values);

      // Transform leaves into the desired format
      const leavesPayload = values.leaves.map((leave: any) => ({
        date: leave.date,
        leaveId: leave.value,
      }));

      const payload: any = await transformData(values);
      const finalLeave = leavesPayload.filter((element: any) => {
        // Return true to keep the element, false to discard it
        return element.leaveId != "";
      });

      payload.leave = finalLeave;

      console.log("payload", payload);

      const res: any = await logHours(payload);
      console.log("res", res);

      if (res && res.data?.error === false) {
        toast.success(res?.data?.message);
        setRedirect(true);
        // navigate(ROUTES.REPORTS);
      } else {
        throw res;
      }
    } catch (error) {
      console.log("🚀 ~ formSubmitHandler ~ error:", error);
    }
  };

  const formik = useFormik<typeof initialValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: formSubmitHandler,
  });

  useEffect(() => {
    if (redirect) {
      navigate(ROUTES.REPORTS);
    }
  }, [redirect, navigate]);

  useEffect(() => {
    if (isOtherThanPM && userData?.empId) {
      getAssignedProjects({ employeeId: userData.empId });
    }
  }, [isOtherThanPM, userData]);
  console.log("formik", formik.values);
  
  return (
    <section className="add_report">
      {/* {projectsFetching || leavesFetched &&
        <Loader fullscreen={true} />
      } */}
      <Container>
        <div className="card_in">
        <p className="qoute">Your effort matters! Please log 8 hours and any extra hours for today</p>
          <div className="card_header mb-5 d-flex align-items-center">
            <PageHeading title="Log Hours" className="mb-0" />
            <div className="custom_datepicer">
              <WeekSelector />
            </div>
          </div>

          <div className="projects_filter">
          
            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit}>
                {/* Employee Info */}
                {console.log("isOtherThanPM", isOtherThanPM)}
                <Row>
                  <Col sm={6} lg={3}>
                    <Select
                      label="Employee Name"
                      options={employeesOptions}
                      isDisabled={isOtherThanPM}
                      placeholder="Employee Name"
                      {...formik.getFieldProps("employeeName")}
                      formik={formik}
                      value={formik.values.employeeName}
                      name="employeeName"
                      onChangeCallback={async (selected) => {
                        console.log("selected", selected);
                        if (Object.keys(selected).length > 0) {
                          setEmpName(selected);
                        }

                        const selectedUserDetailedData = pmUsers?.find(
                          (u: any) => {
                            return u.employeeId === selected?.value;
                          }
                        );
                        setJobRole(selectedUserDetailedData?.role);
                        formik.setFieldValue(
                          "jobRole",
                          selectedUserDetailedData?.role
                        );
                        await getAssignedProjects({
                          employeeId: selected?.value,
                        });
                      }}
                    />
                  </Col>
                  <Col sm={6} lg={3}>
                    <Input
                      label="Job Role"
                      placeholder="Job Role"
                      disabled={true}
                      formik={formik}
                      {...formik.getFieldProps("jobRole")}
                    />
                  </Col>
                </Row>
                {/* <hr /> */}

                {/* Projects Info  */}
                <h3>All Assigned Projects</h3>
                {projectsFetching && "Loading..."}
                {projectsFetched &&
                assignedProjects?.data?.projectData?.length > 0
                  ? assignedProjects?.data?.projectData?.map(
                      (p: any, projectIndex: number) => {
                        const {
                          reportingCode,
                          remainingHours,
                          name,
                          id,
                          managerId,
                          areExtraHours,
                        } = p;

                        return (
                          <div className="add_report_single">
                            <Row key={id}>
                              <Col sm={6} md={3} xl={2}>
                                <Input
                                  label="Project Name"
                                  placeholder="Project Name"
                                  disabled={true}
                                  formik={formik}
                                  {...formik.getFieldProps(
                                    `projectsData[${projectIndex}].name`
                                  )}
                                  value={name}
                                />
                              </Col>
                              <Col sm={6} md={3} xl={2}>
                                <Input
                                  label="Reporting Code"
                                  placeholder="Reporting Code"
                                  disabled={true}
                                  formik={formik}
                                  {...formik.getFieldProps(
                                    `projectsData[${projectIndex}].reportingCode`
                                  )}
                                  value={reportingCode}
                                />
                              </Col>
                              <Col sm={6} md={3} xl={2}>
                                <Input
                                  label="Remaining Hours"
                                  placeholder="Remaining Hours"
                                  disabled={true}
                                  formik={formik}
                                  {...formik.getFieldProps(
                                    `projectsData[${projectIndex}].remainingHours`
                                  )}
                                  value={remainingHours || 0}
                                />
                              </Col>

                              {/* Log Working Hours */}
                              <Col md={12}>
                                <div className="working_hours">
                                  <Row>
                                    {currentWeekDates?.map((d, dateIndex) => {
                                      const isDisabled = isFuture(d?.date);

                                      return (
                                        <Col
                                          xs={12}
                                          sm={6}
                                          md={3}
                                          lg={2}
                                          xl
                                          key={d?.formattedDate}
                                        >
                                          <div className="working_hours_field">
                                            <Label>
                                              {`${d?.formattedDay}, ${d?.shortDate} ${d?.month}`}
                                            </Label>
                                            <div className="working_hours_field_in">
                                              {dateIndex != 6 && (
                                                <Input
                                                  placeholder="Hrs"
                                                  className="mb-0"
                                                  type="text"
                                                  onKeyDown={(evt) =>
                                                    isNumber(evt) &&
                                                    evt.preventDefault()
                                                  }
                                                  maxLength={3}
                                                  disabled={
                                                    isDisabled ||
                                                    remainingHours == 0 ||
                                                    (!isOtherThanPM &&
                                                      managerId !==
                                                        userData?.empId)
                                                  }
                                                  formik={formik}
                                                  {...formik.getFieldProps(
                                                    `projectsData[${projectIndex}].dates[${dateIndex}].hours`
                                                  )}
                                                  value={
                                                    formik.values.projectsData[
                                                      projectIndex
                                                    ]?.dates[dateIndex]?.hours
                                                  }
                                                />
                                              )}
                                              <Input
                                                placeholder="Extra Hrs"
                                                className="mb-0"
                                                type="text"
                                                onKeyDown={(evt) =>
                                                  isNumber(evt) &&
                                                  evt.preventDefault()
                                                }
                                                maxLength={3}
                                                disabled={
                                                  isDisabled ||
                                                  remainingHours == 0 ||
                                                  (!isOtherThanPM &&
                                                    managerId !==
                                                      userData?.empId)
                                                }
                                                formik={formik}
                                                {...formik.getFieldProps(
                                                  `projectsData[${projectIndex}].dates[${dateIndex}].extraHours`
                                                )}
                                              />
                                              {/* )} */}
                                            </div>
                                          </div>
                                        </Col>
                                      );
                                    })}
                                  </Row>
                                </div>
                              </Col>
                              {typeof formik?.errors?.projectsData ===
                                "string" && (
                                <Error>
                                  <p>{formik?.errors?.projectsData}</p>
                                </Error>
                              )}

                              {/* Log Leave Hours */}
                            </Row>
                            {/* <hr /> */}
                          </div>
                        );
                      }
                    )
                  : "No Assigned Project"}
                {projectsFetched &&
                  assignedProjects?.data?.projectData?.length > 0 && (
                    <Col md={12}>
                      <div className="working_hours wk">
                        <Row>
                          <h3 className="mt-4 mb-2">Leaves</h3>
                          {WEEK_DAYS.map((day, index) => {
                            const isDisableds = isFuture(
                              currentWeekDates[index]?.date
                            );
                            return (
                              <Col xs={6} md={3} xl key={day}>
                                <div className="working_hours_field">
                                  <Select
                                    formik={formik}
                                    options={leavesOptions}
                                    name={day}
                                    isDisabled={isDisableds}
                                    value={formik.values?.leaves[index]}
                                    label={`${day}(${currentWeekDates[index]?.shortDate} ${currentWeekDates[index]?.month})`}
                                    onChangeCallback={(selected) => {
                                      console.log("DATE SELECTED", selected);
                                      const selectedLeave = {
                                        date: currentWeekDates[index]
                                          ?.formattedDate,
                                        value: selected?.value,
                                        label: selected?.label,
                                        hours: selected?.hours,
                                      };

                                      // Find if there's already a leave selected for this date
                                      const existingLeaveIndex =
                                        formik.values.leaves.findIndex(
                                          (leave: any) =>
                                            leave.date === selectedLeave.date
                                        );

                                      if (existingLeaveIndex !== -1) {
                                        // Update the existing leave
                                        const updatedLeaves: any = [
                                          ...formik.values.leaves,
                                        ];
                                        updatedLeaves[existingLeaveIndex] =
                                          selectedLeave;

                                        formik.setFieldValue(
                                          "leaves",
                                          updatedLeaves
                                        );
                                      } else {
                                        // Add a new leave

                                        formik.setFieldValue(
                                          `leaves[${index}]`,
                                          selectedLeave
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    </Col>
                  )}

                {/* Buttons */}
                <div className="create_btns mt-5">
                  <Button
                    loading={loggedHoursLoading}
                    type="submit"
                    disabled={
                      loggedHoursLoading ||
                      !formik.isValid ||
                      !formik.dirty || // Check if the form is dirty
                      Boolean(formik.values.projectsData?.length == 0)
                    }
                  >
                    Submit
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

export default AddReport;
