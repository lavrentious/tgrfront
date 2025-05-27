import React, { useMemo } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

interface NavbarItemProps {
  to: string;
  inactiveIcon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const NavbarItem: React.FC<NavbarItemProps> = ({
  to,
  inactiveIcon,
  activeIcon,
  children,
}) => {
  const location = useLocation();
  const icon = useMemo(() => {
    if (!activeIcon || !inactiveIcon) {
      return inactiveIcon || activeIcon || <></>;
    }
    return location.pathname === to ? activeIcon : inactiveIcon;
  }, [activeIcon, inactiveIcon, location.pathname, to]);

  return (
    <Nav.Link as={Link} to={to} active={location.pathname === to}>
      {icon} {children}
    </Nav.Link>
  );
};

export default NavbarItem;
