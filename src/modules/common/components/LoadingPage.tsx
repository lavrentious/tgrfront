import { Container, Spinner } from "react-bootstrap";

const LoadingPage = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="primary" />
    </Container>
  );
};

export default LoadingPage;
