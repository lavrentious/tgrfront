import * as React from "react";
import { Button, Spinner } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import Logo from "src/assets/tg_logo.png";
import { AuthService } from "src/modules/users/services/auth.service";
import { RootState } from "src/store";
import "./Navbar.css";

const AuthStatus = ({ user, isAuthLoading }: RootState["auth"]) => {
  const isLoggedIn = !!user;
  if (isAuthLoading) {
    return <Spinner animation="border" className="align-self-center" />;
  }
  if (isLoggedIn) {
    return (
      <>
        <LinkContainer to={`/profile/${user.username ?? user.id}`}>
          <Nav.Link>Мой профиль</Nav.Link>
        </LinkContainer>
        <Button variant="danger" onClick={AuthService.logout}>
          Выход
        </Button>
      </>
    );
  }
  return (
    <>
      <LinkContainer to="/login">
        <Nav.Link>Вход</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/register">
        <Nav.Link>Регистрация</Nav.Link>
      </LinkContainer>
    </>
  );
};

const Navbar: React.FunctionComponent = () => {
  const { user, isAuthLoading } = useSelector((state: RootState) => state.auth);
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
              <LinkContainer to="/record-search">
                <Nav.Link>🔍 Поиск мест</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/user-search">
                <Nav.Link>👤 Поиск пользователей</Nav.Link>
              </LinkContainer>
            </div>
            <div className="d-flex flex-wrap">
              <AuthStatus isAuthLoading={isAuthLoading} user={user} />
            </div>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
