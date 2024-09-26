import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useRouteError } from "react-router-dom";
import Button from "../../common/Button/Button";
import Loader from "../../common/Loader/Loader";

// Define the type for the error object
interface RouterError {
  message: string;
  stack?: string;
}

const ErrorPage = () => {
  const error = useRouteError() as RouterError | undefined;
  const navigate = useNavigate();

  if (!error) {
    return <Loader />;
  }

  return (
    <section className="error_page">
      <Container>
        <Row className="justify-content-center">
          <Col xl={6} lg={8}>
            <div className="error_page_card">
              <h2>Error - {error.stack?.split(":")[0]}</h2>
              <h1>{error.message}</h1>
              <p>
                <pre>{error.stack}</pre>
              </p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ErrorPage;
