import { Container } from "react-bootstrap";
import { PenIcon, TrashIcon } from "../../../assets/icons/icons";
import Button from "../../common/Button/Button";
import Select from "../../common/form/Select/Select";
import PageHeading from "../../common/PageHeading/PageHeading";
import Table from "../../common/Table/Table";
import "./Reports.scss";
import AddReports from "../../common/modals/AddReports/AddReports";
import { useEffect, useState } from "react";
import CommonPagination from "components/common/CommonPagination/CommonPagination";
import { useNavigate } from "react-router-dom";
import { API_DATA_LIMIT, ROUTES } from "utils/constants";
import { checkValidData, getSerialNumbers } from "utils/helpers";
import {
  useGetAllProjectListQuery,
  useGetLogHoursListQuery,
} from "services/logHours";
import { Formik, FormikProps } from "formik"; // Import Formik and FormikProps
import { useGetMyUsersQuery } from "services/users";
import { useSelector } from "react-redux";
import NoRecordFound from "components/common/NoRecordFound/NoRecordFound";
import { FilterIcon } from "assets/images/Svgicons";

export type ReportType = {
  id: number;
  projectName: string;
  jobRole: string;
  employee_id: string;
  employee_name: string;
  date: string;
  log_hours: number;
  remarks: string;
};

const Reports = () => {
  const navigate = useNavigate();

  // State
  const [page, setPage] = useState<number>(1);
  const [show, setShow] = useState(false);

  const [projectId, setProjectId] = useState({ value: "All", label: "All" });
  const [employeeId, setEmployeeId] = useState({ value: "All", label: "All" });

  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc'); 

  // API's
  const { data: timeLogsData, isSuccess: timeLogsFetched } =
    useGetLogHoursListQuery({
      projectId: projectId?.value, // Pass empty string if not available
      employeeId: employeeId?.value, // Pass empty string if not available
      page: page,
      limit: API_DATA_LIMIT,
      sortKeyName: sortKey,
      sortOrder: sortOrder,
    });


  // Reset variables on each API hit and fetch data

  const { data: allProjectsData, isSuccess: allProjectsFetched,refetch } =
    useGetAllProjectListQuery({}); //vik

  const userData = useSelector((state: any) => state.user.userData);
  const roleType = userData?.roleType;
  const { data: pmUsers, isSuccess: isPmUserFetched } = useGetMyUsersQuery(
    {},
    {
      skip: roleType !== "ADMIN" && roleType !== "PM",
    }
  );
  console.log("pmUsers", pmUsers);

  const fields = [
    { name: "Sr. No." },
    { name: <>Project Name<button onClick={() => handleSort('')}><FilterIcon /></button></> },
    { name: "Team Member" },
    { name: "Emp ID" },
    { name: "Reporting Code" },
    { name: "Role" },
    { name: "Total" },
    { name: "Remaining" },
    { name: "Consumed" },
  ];

  const projectOptions = [
    { label: "All", value: "" }, // Add the "All" option
    ...(allProjectsData?.data?.map((options: any) => ({
      label: options.projectName,
      value: options.projectId,
    })) || []), // Ensuring an empty array if pmUsers is undefined or null
  ];

  const employeeIdOptions = [
    { label: "All", value: "" }, // Add the "All" option
    ...(pmUsers?.employees?.map((options: any) => ({
      label: options.name + "(" + options.employeeCode + ")",
      value: options.employeeId,
    })) || []), // Ensuring an empty array if pmUsers is undefined or null
  ];

  const totalAllocatedHours = timeLogsData?.data?.projects.reduce(
    (sum: any, item: any) => sum + (item.allocatedHours || 0),
    0
  );
  const totalRemainingHours = timeLogsData?.data?.projects.reduce(
    (sum: any, item: any) => sum + (item.remainingHours || 0),
    0
  );
  const totalConsumedHours = timeLogsData?.data?.projects.reduce(
    (sum: any, item: any) => sum + (item.consumedHours || 0),
    0
  );
  const handleSort = (key: string) => {
    // If the same column is clicked, toggle the sort order
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If a new column is clicked, reset sortOrder to 'asc'
      setSortKey(key);
      setSortOrder('asc');
    }
    // Reset to page 1 whenever sorting is changed
  setPage(1);
  };
  
  // Use a separate useEffect to check initial loading
  useEffect(() => {
    if (sortKey && sortOrder) {
      refetch(); // Fetch data only when sortKey and sortOrder are set
    }
  }, [sortKey, sortOrder, refetch]);
  
  const handleRefetch = () => {
    refetch();
  };

  return (
    <section className="reports_page">
      <Container>
        <div className="card_in">
          <PageHeading title="Hours Log" />
          <Formik
            initialValues={{
              project: projectOptions[0].value,
              employeeId: employeeIdOptions[0].value,
            }}
            onSubmit={(values) => {
              console.log("Form values:", values);
            }}
          >
            {(formik: FormikProps<any>) => (
              <form onSubmit={formik.handleSubmit}>
                <div className="filters">
                  {/* {!isOtherThanPM && ( */}
                  <div className="filter_option">
                    <Select
                      name="project"
                      label="Project"
                      value={projectId}
                      options={projectOptions}
                      onChangeCallback={(selected: any) => {
                        console.log("SELECTED", selected);
                        setProjectId(selected);
                        setPage(1)
                      }}
                      placeholder="Project"
                      formik={formik}
                    />
                  </div>
                  {/* // )} */}
                  {(roleType == "ADMIN" || roleType == "PM") && (
                    <div className="filter_option">
                      <Select
                        name="employeeId"
                        placeholder="Employee ID"
                        label="Employee ID"
                        // defaultValue={employeeIdOptions[0]}
                        value={employeeId}
                        options={employeeIdOptions}
                        formik={formik}
                        onChangeCallback={(selected: any) => {
                          console.log("SELECTED", selected);
                          setEmployeeId(selected);
                          setPage(1)
                        }}
                      />
                    </div>
                  )}
                  {roleType !== "ADMIN" && (
                    <div className="filter_action filter_option ms-auto">
                      <Button onClick={() => navigate(ROUTES.ADD_REPORT)} fluid>
                        Log Hours
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </Formik>
          <Table fields={fields}>
            {timeLogsData?.data?.projects.length > 0 ? (
              timeLogsData?.data?.projects.map((item: any, idx: number) => {
                return (
                  <tr key={idx}>
                    <td>{getSerialNumbers(idx, page)}</td>
                    <td>{checkValidData(item?.project_details?.name)}</td>
                    <td>
                      {checkValidData(
                        item?.employee?.employeeDetails?.fullName
                      )}
                    </td>
                    <td>
                      {checkValidData(
                        item?.employee?.employeeDetails?.employeeCode
                      )}
                    </td>
                    <td>
                      {checkValidData(item?.project_details?.reportingCode)}
                    </td>
                    <td>{checkValidData(item?.employee?.role?.role)}</td>
                    <td>{checkValidData(item?.allocatedHours)}h</td>
                    <td>{item?.remainingHours}h</td>
                    <td>{item?.consumedHours}h</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <NoRecordFound colSpan={fields.length} />
              </tr>
            )}
            {timeLogsData?.data?.projects.length > 0 && (
              <tr key="extra-row" className="extra-row">
                <td>
                  <strong>Total hours</strong>
                  {/* {getSerialNumbers(timeLogsData?.data?.projects.length, page)} */}
                </td>
                <td><strong>N/A</strong></td>
                <td><strong>N/A</strong></td>
                <td><strong>N/A</strong></td>
                <td><strong>N/A</strong></td>
                <td><strong>N/A</strong></td>
                <td><strong>{totalAllocatedHours}h</strong></td>
                <td><strong>{totalRemainingHours}h</strong></td>
                <td><strong>{totalConsumedHours}h</strong></td>

              </tr>
            )}
          </Table>
          {/* <CommonPagination /> */}
          <CommonPagination
            pageCount={Math.ceil(
              timeLogsData?.data?.totalItems / API_DATA_LIMIT
            )}
            page={page}
            onPageChange={(e: any) => setPage(e.selected + 1)}
          />
        </div>
      </Container>

      {/* Add Report Modal */}
      <AddReports show={show} handleClose={() => setShow(false)} />
    </section>
  );
};

export default Reports;
