import * as React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import Logo from "src/assets/tg_logo.png";
import "./Navbar.css";

const Navbar: React.FunctionComponent = () => {
  return (
    <BootstrapNavbar
      id="navbar"
      expand="lg"
      variant="light"
      bg="light"
      sticky="top"
    >
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand className="d-flex flex-nowrap align-items-center">
            <img src={Logo} alt="logo" width="35" height="35" />
            <strong>TifloGuide</strong>
          </BootstrapNavbar.Brand>
        </LinkContainer>
        <BootstrapNavbar.Toggle>
          <span className="navbar-toggler-icon" />
        </BootstrapNavbar.Toggle>

        <BootstrapNavbar.Collapse>
          <Nav className="me-auto align-items-center">
            <LinkContainer to="/map">
              <Nav.Link>🗺 Карта</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/">
              <Nav.Link>📄 О проекте</Nav.Link>
            </LinkContainer>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
