import { Col, Container, Row } from "react-bootstrap";
import "../ErrorPage/ErrorPage.scss";
import { useNavigate } from "react-router-dom";
import Button from "../../common/Button/Button";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <section className="error_page">
      <Container>
        <Row className="justify-content-center">
          <Col xl={6} lg={8}>
            <div className="error_page_card">
              <h2>Error - 404</h2>
              <h1>
                Sorry !!! <br />
                There's No Page.
              </h1>
              <p>
                The page you are looking for is not available for the moment!!!{" "}
                <br /> You can go home or please try again later.
              </p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PageNotFound;
