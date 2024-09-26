import PageHeading from "components/common/PageHeading/PageHeading";
import { Col, Container, Row } from "react-bootstrap";
import './AddUser.scss';
import Table from "components/common/Table/Table";
import NoRecordFound from "components/common/NoRecordFound/NoRecordFound";
import { FilterIcon } from "assets/images/Svgicons";
// import {
//   READABLE_ROUTES,
//   REGEX,
//   ROUTES,
//   VALIDATION_MESSAGES,
//   Yup,
// } from "../../../utils/constants";
import { useFormik } from "formik";
import Button from "components/common/Button/Button";
import Select from "components/common/form/Select/Select";
import Input from "components/common/form/Input/Input";
const AddUser = () => {
    // Formik
    const initialValues = {
        fname: "",
        lname: "",
        empid: "",
        email: ""
        // selectrole: ""
    };
    //   const validationSchema = Yup.object({
    // email: Yup.string().label("Email"), 
    //   });
    const formik = useFormik<typeof initialValues>({
        initialValues,
        // validationSchema,
        onSubmit: alert,
    });
    const fields = [
        { name: "User" },
        { name: <>Role <button><FilterIcon /></button></> },
        { name: <>Last Active <button><FilterIcon /></button></> }
    ];
    const data = [
        {
            user: "Charanjit",
            email: "charanjit@antiersolutions.com",
            role: "Admin",
            empid: "747",
            lastActive: "Sep 02, 2024"
        },
        {
            user: "Vikrant",
            email: "vikrant.kumar@antiersolutions.com",
            role: "Project Manager",
            empid: "123",
            lastActive: "Sep 09, 2024"
        },
        {
            user: "Rohan",
            email: "rohan@antiersolutions.com",
            role: "Admin",
            empid: "798",
            lastActive: "Aug 02, 2024"
        },
        {
            user: "Charanjit",
            email: "charanjit@antiersolutions.com",
            role: "Project Manager",
            empid: "747",
            lastActive: "Sep 02, 2024"
        }
    ]
    const options = [
        { value: "pm", label: "Project Manager" },
        { value: "admin", label: "Admin" },
    ];
    return (
        <section className="adduser">
            <Container>
                <div className="card_in">
                    <PageHeading title="Add User" />
                    <form onSubmit={formik.handleSubmit}>
                        <Row className="pb-5">
                            <Col sm={6} md={3}>
                                <Input
                                    label="First Name"
                                    placeholder="Enter first name"
                                    name="fname"
                                    type="text"
                                    // onChange={formik.handleChange}
                                    // onBlur={formik.handleBlur}
                                    // error={formik.errors.email}
                                    value={formik.values.fname}
                                    className="form_input"
                                // formik={formik}
                                />
                            </Col>
                            <Col sm={6} md={3}>
                                <Input
                                    label="Last Name"
                                    placeholder="Enter last name"
                                    name="lname"
                                    type="text"
                                    // onChange={formik.handleChange}
                                    // onBlur={formik.handleBlur}
                                    // error={formik.errors.email}
                                    value={formik.values.fname}
                                    className="form_input"
                                // formik={formik}
                                />
                            </Col>
                            <Col sm={6} md={3}>
                                <Input
                                    label="Employee ID"
                                    placeholder="Enter emp id"
                                    name="empid"
                                    type="text"
                                    // onChange={formik.handleChange}
                                    // onBlur={formik.handleBlur}
                                    // error={formik.errors.email}
                                    value={formik.values.empid}
                                    className="form_input"
                                // formik={formik}
                                />
                            </Col>
                            <Col sm={6} md={3}>
                                <Select
                                    label="Select Role"
                                    options={options}
                                    // isDisabled={isOtherThanPM}
                                    placeholder="Select Role"
                                    {...formik.getFieldProps("employeeName")}
                                    formik={formik}
                                    // value={formik.values.selectrole}
                                    name="selectrole"
                                // onChangeCallback={async (selected) => {
                                //     console.log("selected", selected);
                                //     if (Object.keys(selected).length > 0) {
                                //         setEmpName(selected);
                                //     }
                                //     const selectedUserDetailedData = pmUsers?.find(
                                //         (u: any) => {
                                //             return u.employeeId === selected?.value;
                                //         }
                                //     );
                                //     setJobRole(selectedUserDetailedData?.role);
                                //     formik.setFieldValue(
                                //         "jobRole",
                                //         selectedUserDetailedData?.role
                                //     );
                                //     await getAssignedProjects({
                                //         employeeId: selected?.value,
                                //     });
                                // }}
                                />
                            </Col>
                            <Col sm={3}>
                                <Input
                                    label="Email"
                                    placeholder="Enter your email"
                                    name="email"
                                    type="email"
                                    // onChange={formik.handleChange}
                                    // onBlur={formik.handleBlur}
                                    // error={formik.errors.email}
                                    value={formik.values.email}
                                    className="form_input"
                                // formik={formik}
                                />
                            </Col>
                            <Col sm={3} className="mt-4 pt-3    ">
                                <Button
                                    type="submit"
                                    disabled={formik.isSubmitting || !formik.isValid}
                                    className="submit_btn"
                                    loading={formik.isSubmitting}
                                    fluid
                                >
                                    Invite User
                                </Button>

                            </Col>
                        </Row>
                        {/* <p className="sign_up_txt">
          Don't have an account? <Link to={ROUTES.REGISTER}>Sign up here.</Link>
        </p> */}
                    </form>
                    <Table fields={fields} className="adduser_table">
                        {data.length > 0 ? (
                            data.map((item: any, idx: number) => {
                                return (
                                    <tr key={idx}>
                                        <td className="adduser_table_email"><h5>{item.user} (ATR{item.empid})</h5> <span>{item.email}</span></td>
                                        <td>{item.role} <button><FilterIcon /></button></td>
                                        <td>{item.lastActive}</td>
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
            </Container>
        </section>
    )
}
export default AddUser