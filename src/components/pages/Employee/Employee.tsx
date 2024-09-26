import React, { useEffect, useRef, useState } from "react";
import PageHeading from "components/common/PageHeading/PageHeading";
import Table from "components/common/Table/Table";
import { Container, Overlay, Tooltip } from "react-bootstrap";
import CommonPagination from "components/common/CommonPagination/CommonPagination";
import { useGetAllUsersQuery } from "services/users";
import { checkValidData, getSerialNumbers } from "utils/helpers";
import { API_DATA_LIMIT } from "../../../utils/constants";
import NoRecordFound from "components/common/NoRecordFound/NoRecordFound";
import { FilterIcon } from "assets/images/Svgicons";

export type ReportType = {
  empId: string;
  empName: string;
  employeeCode: string;
  role: string;
  projectId: string;
  projectName: string;
  reportingCode: string;
  projectManager: string;
  isAvaliable: boolean;
};

const Employee = () => {
  const fields = [
    { name: "Sr. No." },
    { name: <>Name<button onClick={() => handleSort('full_name')}><FilterIcon /></button></> },
    { name: "Email", className:"email" },
    { name: "Job Role" },
    { name: "Reporting Code" },
    { name: "Project Manager" },

    { name: "Status" },
  ];

  // State
  const [page, setPage] = useState<number>(1);
  const [sortKey, setSortKey] = useState<string>('full_name');
  const [sortOrder, setSortOrder] = useState<string>('asc');

  // API
  const {
    data: teamMembersRecord,
    isLoading,
    isSuccess: usersFetched,refetch
  } = useGetAllUsersQuery({ 
    page, 
    limit: API_DATA_LIMIT,
    sortKeyName: sortKey,
    sortOrder: sortOrder,
   });
  const [showTooltipReportCode, setShowTooltipReportCode] = useState<
    Record<number, boolean>
  >({});
  const [showTooltipPM, setShowTooltipReportCodePM] = useState<
    Record<number, boolean>
  >({});

  const targetRefsReportingCode = useRef<Array<HTMLButtonElement | null>>([]);
  const targetRefsPmName = useRef<Array<HTMLButtonElement | null>>([]);

  const handleToggleTooltip = (index: number) => {
    setShowTooltipReportCode((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the specific tooltip visibility
    }));
  };
  

  const handleClickOutsideForReportingCode = (event: MouseEvent) => {
    targetRefsReportingCode.current.forEach((ref, index) => {
      if (ref && !ref.contains(event.target as Node)) {
        setShowTooltipReportCode((prev) => ({
          ...prev,
          [index]: false,
        }));
      }
    });
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideForReportingCode);
    document.addEventListener("click", handleClickOutsideForReportingCodePm);

    return () => {
      document.removeEventListener("click", handleClickOutsideForReportingCode);
      document.removeEventListener(
        "click",
        handleClickOutsideForReportingCodePm
      );
    };
  }, []);

  const handleToggleTooltipPm = (index: number) => {
    setShowTooltipReportCodePM((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the specific tooltip visibility
    }));
  };

  const handleClickOutsideForReportingCodePm = (event: MouseEvent) => {
    targetRefsPmName.current.forEach((ref, index) => {
      if (ref && !ref.contains(event.target as Node)) {
        setShowTooltipReportCodePM((prev) => ({
          ...prev,
          [index]: false,
        }));
      }
    });
  };
  const getProjectCode = (project: any) => {
    const reportingCode = project.map((item: any) => {
      return item.reportingCode;
    });

    return reportingCode;
  };
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

  const getProjectManger = (project: any) => {
    const reportingCode = project.map((item: any) => {
      return item.projectManager.name + "(" + item?.projectManager?.employeeCode + ")";
    });

    return reportingCode;
  };

  return (
    <section className="employee_page">
      <Container>
        <div className="card_in">
          <PageHeading
            title="Team Members"
          // subTitle="These are the daily reports of Employees"
          />
          <div className="project_table">
            <Table fields={fields}>
              {teamMembersRecord?.employeeList?.length > 0 ? (
                teamMembersRecord?.employeeList.map((item: any, idx: any) => {
                  {
                    console.log("item", item);
                  }
                  return (
                    <tr key={item.idx}>
                      <td>{getSerialNumbers(idx, page)}</td>
                      <td>
                        {checkValidData(item.empName)}({item?.employeeCode})
                      </td>
                      <td className="email">{item?.empEmail}</td>
                      <td>{checkValidData(item?.role?.roleType)}</td>
                      <td>
                        {checkValidData(
                          getProjectCode(item.projects).slice(0, 2).join(", ")
                        )}
                        {item.projects?.length > 2 && (
                          <>
                            <button
                              type="button"
                              className="members-tooltip-btn"
                              ref={(el) =>
                                (targetRefsReportingCode.current[idx] = el)
                              }
                              onClick={() => handleToggleTooltip(idx)}
                              key={`button-${idx}`}
                            >
                              {item.projects.length - 2} More
                            </button>

                            <Overlay
                              target={targetRefsReportingCode.current[idx]}
                              show={!!showTooltipReportCode[idx]}
                              placement="auto"
                              key={`overlay-${idx}`}
                            >
                              {(props) => (
                                <Tooltip
                                  id={`tooltip-${idx}`}
                                  className="members-tooltip"
                                  {...props}
                                >
                                  <ul>
                                    {item.projects.map((ele: any, i: any) =>
                                      i > 1 ? (
                                        <li key={i}>
                                          <strong>{ele?.reportingCode}</strong>
                                        </li>
                                      ) : null
                                    )}
                                  </ul>
                                </Tooltip>
                              )}
                            </Overlay>
                          </>
                        )}
                      </td>
                      {/* PM  */}
                      <td>
                        {checkValidData(
                          getProjectManger(item.projects).slice(0, 2).join(", ")
                        )}
                        {item.projects?.length > 2 && (
                          <>
                            <button
                              type="button"
                              className="members-tooltip-btn"
                              ref={(el) => (targetRefsPmName.current[idx] = el)} // Assign ref dynamically using index
                              onClick={() => handleToggleTooltipPm(idx)} // Pass index to manage state
                              key={`button-${idx}`}
                            >
                              {item.projects.length - 1} More
                            </button>

                            <Overlay
                              target={targetRefsPmName.current[idx]}
                              show={!!showTooltipPM[idx]} // Show the tooltip for the specific index
                              placement="auto"
                              key={`overlay-${idx}`}
                            >
                              {(props) => (
                                <Tooltip
                                  id={`tooltip-${idx}`}
                                  className="members-tooltip"
                                  {...props}
                                >
                                  <ul>
                                    {item.projects.map((ele: any, i: any) =>
                                      i > 1 ? ( // Render only if index is greater than 1
                                        <li key={i}>
                                          <strong>
                                            {ele?.projectManager?.name}
                                          </strong>
                                        </li>
                                      ) : null
                                    )}
                                  </ul>
                                </Tooltip>
                              )}
                            </Overlay>
                          </>
                        )}
                      </td>

                      <td>
                        {checkValidData(
                          item.isAvaliable ? "Occupied" : "Available"
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <NoRecordFound colSpan={fields.length} />
                </tr>
              )}
            </Table>
            <CommonPagination
              pageCount={Math.ceil(
                teamMembersRecord?.totalItems / API_DATA_LIMIT
              )}
              page={page}
              onPageChange={(e: any) => setPage(e.selected + 1)}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Employee;
