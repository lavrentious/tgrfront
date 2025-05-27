import { useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import {
  RiFileLine as AboutIcon,
  RiFileFill as AboutIconActive,
  RiLoginBoxLine as LoginIcon,
  RiLoginBoxFill as LoginIconActive,
  RiMapLine as MapIcon,
  RiMapFill as MapIconActive,
  RiUserLine as ProfileIcon,
  RiUserFill as ProfileIconActive,
  RiSearchLine as RecordSearchIcon,
  RiSearchFill as RecordSearchIconActive,
  RiUserAddLine as RegisterIcon,
  RiUserAddFill as RegisterIconActive,
  RiUserSearchLine as UserSearchIcon,
  RiUserSearchFill as UserSearchIconActive,
} from "react-icons/ri";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "src/assets/tg_logo.png";
import { useLogoutMutation } from "src/modules/users/api/auth.api";
import { TokenService } from "src/modules/users/services/token.service";
import { useAppDispatch, type RootState } from "src/store";
import { setUser } from "src/store/auth.reducer";
import "./Navbar.css";
import NavbarItem from "./NavbarItem";

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
        <NavbarItem
          to={`/profile/${user.username ?? user.id}`}
          inactiveIcon={<ProfileIcon />}
          activeIcon={<ProfileIconActive />}
        >
          {user.username ?? user.name ?? "Мой профиль"}
        </NavbarItem>
        <Button variant="danger" onClick={logout}>
          Выход
        </Button>
      </>
    );
  }
  return (
    <>
      <NavbarItem
        to="/login"
        inactiveIcon={<LoginIcon />}
        activeIcon={<LoginIconActive />}
      >
        Вход
      </NavbarItem>
      <NavbarItem
        to="/register"
        inactiveIcon={<RegisterIcon />}
        activeIcon={<RegisterIconActive />}
      >
        Регистрация
      </NavbarItem>
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
              <NavbarItem
                to="/map"
                inactiveIcon={<MapIcon />}
                activeIcon={<MapIconActive />}
              >
                Карта
              </NavbarItem>
              <NavbarItem
                to="/"
                inactiveIcon={<AboutIcon />}
                activeIcon={<AboutIconActive />}
              >
                О проекте
              </NavbarItem>
              <NavbarItem
                to="/record-search"
                inactiveIcon={<RecordSearchIcon />}
                activeIcon={<RecordSearchIconActive />}
              >
                Поиск мест
              </NavbarItem>
              <NavbarItem
                to="/user-search"
                inactiveIcon={<UserSearchIcon />}
                activeIcon={<UserSearchIconActive />}
              >
                Поиск пользователей
              </NavbarItem>
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
