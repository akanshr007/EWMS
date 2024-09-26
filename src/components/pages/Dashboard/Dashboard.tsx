import React from "react";
import { Container } from "react-bootstrap";
import PageHeading from "../../common/PageHeading/PageHeading";

const Dashboard = () => {
  return (
    <section className="dashboard_page">
      <Container>
        <PageHeading title="Dashboard" subTitle="This is dashboard page" />
      </Container>
    </section>
  );
};

export default Dashboard;
