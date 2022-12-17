import * as React from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import Logo from "src/assets/tg_logo.png";
import { AuthService } from "src/modules/users/services/auth.service";
import { RootState } from "src/store";
import "./Navbar.css";

const Navbar: React.FunctionComponent = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = user != null;
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
          <Nav className="d-flex justify-content-between flex-row w-100">
            <div className="d-flex flex-wrap">
              <LinkContainer to="/map">
                <Nav.Link>🗺 Карта</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/">
                <Nav.Link>📄 О проекте</Nav.Link>
              </LinkContainer>
            </div>
            <div className="d-flex flex-wrap">
              {isLoggedIn ? (
                <>
                  <LinkContainer to={`/profile/${user.id}`}>
                    <Nav.Link>Мой профиль</Nav.Link>
                  </LinkContainer>
                  <Button variant="danger" onClick={AuthService.logout}>
                    Выход
                  </Button>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>Вход</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>Регистрация</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </div>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
