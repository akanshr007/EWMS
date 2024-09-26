import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Overlay, Row, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetDetailedProjectsQuery } from "services/projects";
import { API_DATA_LIMIT, ROUTES } from "utils/constants";
import { checkValidData, getSerialNumbers } from "utils/helpers";
import Table from "components/common/Table/Table";
import Button from "components/common/Button/Button";
import CommonPagination from "components/common/CommonPagination/CommonPagination";
import NoRecordFound from "components/common/NoRecordFound/NoRecordFound";
import EnableProjects from "components/common/modals/EnableProjects/EnableProjects";
import PageHeading from "components/common/PageHeading/PageHeading";
import { PenIcon } from "assets/icons/icons";
import "./Projects.scss";
import { FilterIcon } from "assets/images/Svgicons";


const Projects = () => {
  const [show, setShow] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [sortKey, setSortKey] = useState<string>('Name');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const permittedRoutes = useSelector((state: any) => state.user.permissions);
  const userData = useSelector((state: any) => state.user.userData);
  const roleType = userData?.roleType;
  const navigate = useNavigate();

  const { data: projectsList, refetch } = useGetDetailedProjectsQuery({
    page:page,
    limit:API_DATA_LIMIT,
    sortKeyName: sortKey,
    sortOrder: sortOrder,
    
  });
  const handleSort = (key: string) => {
    // If the same column is clicked, toggle the sort order
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If a new column is clicked, reset sortOrder to 'asc'
      setSortKey(key);
      setSortOrder('asc');
    }
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
  
  // State for managing the tooltip visibility and refs
  const [showTooltip, setShowTooltip] = useState<Record<number, boolean>>({});
  const targetRefs = useRef<Array<HTMLButtonElement | null>>([]);
  
  const handleToggleTooltip = (index: number) => {
    setShowTooltip((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the specific tooltip visibility
    }));
  };
  
  const handleClickOutside = (event: MouseEvent) => {
    targetRefs.current.forEach((ref, index) => {
      if (ref && !ref.contains(event.target as Node)) {
        setShowTooltip((prev) => ({
          ...prev,
          [index]: false,
        }));
      }
    });
  };
  
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const fields = [
    { name: "Sr. No." },
    { name: <>Name<button onClick={() => handleSort('Name')}><FilterIcon /></button></> },
    { name: <>Reporting Code<button onClick={() => handleSort('reportingCode')}><FilterIcon /></button></> },
    { name: "Status"},
    { name: "Estimation"},
    { name: "Consumed"},
    { name: "Remaining"},
    { name: "Team Members"},
    { name: "Created By"},
    { name: "Created Date"},
    { name: "Action"},
  ];
  
  return (
    <section className="project_page">
      <Container>
        <div className="card_in">
          <Row className="align-items-center">
            <Col xs={6}>
              <PageHeading title="Projects" />
            </Col>
            <Col xs={6}>
              {permittedRoutes?.includes(ROUTES.ENABLE_PROJECT) && (
                <div className="projects_heading addpro">
                  <Button onClick={() => setShow(true)}>Add Project</Button>
                </div>
              )}
            </Col>
          </Row>

          <div className="project_table">
            <Table fields={fields}>
              {projectsList?.projectDetails?.length > 0 ? (
                projectsList?.projectDetails?.map((item: any, idx: number) => {
                  return (
                    <tr key={idx}>
                      <td>{getSerialNumbers(idx, page)}</td>
                      <td>{checkValidData(item.projectName)}</td>
                      <td>{checkValidData(item.reportingCode)}</td>
                      <td className={item.projectStatus}>
                        {checkValidData(item.projectStatus)}
                      </td>
                      <td>
                        {item.totalEstimatedHours !== 0
                          ? item.totalEstimatedHours + "h"
                          : "N/A"}
                      </td>
                      <td>
                        {item?.totalEstimatedHours !== 0 &&
                        item?.consumedHours !== 0 &&
                        item?.remainingHours !== 0
                          ? item.consumedHours + "h"
                          : "N/A"}
                      </td>
                      <td>
                        {item?.totalEstimatedHours !== 0 &&
                        item?.consumedHours !== 0 &&
                        item?.remainingHours !== 0
                          ? item.remainingHours + "h"
                          : "N/A"}
                      </td>
                      <td>
                        {checkValidData(
                          item.employeeNames.slice(0, 2).join(", ")
                        )}
                        {item.employeeNames?.length > 2 && (
                          <>
                            <button
                              type="button"
                              className="members-tooltip-btn"
                              ref={(el) => (targetRefs.current[idx] = el)} // Assign ref dynamically using index
                              onClick={() => handleToggleTooltip(idx)} // Pass index to manage state
                              key={`button-${idx}`}
                            >
                              {item.employeeNames.length - 2} More
                            </button>

                            <Overlay
                              target={targetRefs.current[idx]}
                              show={!!showTooltip[idx]} // Show the tooltip for the specific index
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
                                    {item.employeeNames.map(
                                      (ele: any, i: any) =>
                                        i > 1 ? ( // Render only if index is greater than 1
                                          <li key={i}>
                                            <strong>{ele}</strong>
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
                      <td>{checkValidData(item.createdBy)}</td>
                      <td>{checkValidData(item.createdDate)}</td>
                      <td>
                        {roleType !== "ADMIN" ? (
                          <div className="table_action edit-dlt">
                            <Link
                              to={`${ROUTES.EDIT_PROJECT}/${item.projectId}`}
                            >
                              <PenIcon />
                            </Link>
                          </div>
                        ) : (
                          <div className="table_action edit-dlt">N/A</div>
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
          </div>

          <CommonPagination
              pageCount={Math.ceil(
                projectsList?.totalItems / API_DATA_LIMIT
              )}
              page={page}
              onPageChange={(e: any) => setPage(e.selected + 1)}
            />
        </div>
      </Container>

      {show && (
        <EnableProjects
          show={show}
          handleClose={() => setShow(false)}
          onSuccess={handleRefetch}
        />
      )}
    </section>
  );
};

export default Projects;
