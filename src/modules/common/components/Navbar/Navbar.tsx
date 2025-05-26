import { useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "src/assets/tg_logo.png";
import { useLogoutMutation } from "src/modules/users/api/auth.api";
import { TokenService } from "src/modules/users/services/token.service";
import { useAppDispatch, type RootState } from "src/store";
import { setUser } from "src/store/auth.reducer";
import "./Navbar.css";

const AuthStatus = ({ user, isAuthLoading }: RootState["auth"]) => {
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();
  const logout = useCallback(() => {
    logoutMutation();
    TokenService.clear();
    dispatch(setUser(null));
  }, [dispatch, logoutMutation]);

  if (isAuthLoading) {
    return <Spinner animation="border" className="align-self-center" />;
  }
  if (user) {
    return (
      <>
        <Nav.Link as={Link} to={`/profile/${user.username ?? user.id}`}>
          {user.username ?? user.name ?? "Мой профиль"}
        </Nav.Link>
        <Button variant="danger" onClick={logout}>
          Выход
        </Button>
      </>
    );
  }
  return (
    <>
      <Nav.Link as={Link} to="/login">
        Вход
      </Nav.Link>
      <Nav.Link as={Link} to="/register">
        Регистрация
      </Nav.Link>
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
        <BootstrapNavbar.Brand
          as={Link}
          to="/"
          className="d-flex flex-nowrap align-items-center"
        >
          <img src={Logo} alt="logo" width="35" height="35" />
          <strong>TifloGuide</strong>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle>
          <span className="navbar-toggler-icon" />
        </BootstrapNavbar.Toggle>

        <BootstrapNavbar.Collapse>
          <Nav className="d-flex justify-content-between flex-row w-100">
            <div className="d-flex flex-wrap">
              <Nav.Link as={Link} to="/map">
                🗺 Карта
              </Nav.Link>
              <Nav.Link as={Link} to="/">
                📄 О проекте
              </Nav.Link>
              <Nav.Link as={Link} to="/record-search">
                🔍 Поиск мест
              </Nav.Link>
              <Nav.Link as={Link} to="/user-search">
                👤 Поиск пользователей
              </Nav.Link>
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
