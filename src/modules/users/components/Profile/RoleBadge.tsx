import clsx from "clsx";
import React, { useMemo } from "react";
import { Badge, BadgeProps } from "react-bootstrap";
import {
  RiShieldUserFill as ModeratorIcon,
  RiStarFill as AdminIcon,
  RiUserFill as UserIcon,
  RiUserFollowFill as VerifiedIcon,
} from "react-icons/ri";
import { Role } from "../../models/user.model";

interface BadgeData {
  bg: string;
  icon: React.ReactNode;
  title: string;
}

const badges: Record<Role, BadgeData> = {
  USER: {
    bg: "secondary",
    icon: <UserIcon />,
    title: "Пользователь",
  },
  VERIFIED: {
    bg: "success",
    icon: <VerifiedIcon />,
    title: "Подтвержденный пользователь",
  },
  MODERATOR: {
    bg: "info",
    icon: <ModeratorIcon />,
    title: "Модератор",
  },
  ADMIN: {
    bg: "danger",
    icon: <AdminIcon />,
    title: "Администратор",
  },
};

interface IRoleBadgeProps extends BadgeProps {
  role: Role;
  small?: boolean;
}

const RoleBadge: React.FC<IRoleBadgeProps> = React.memo(function RoleBadge({
  role: userRole,
  small,
  ...props
}: IRoleBadgeProps) {
  const role = useMemo(() => userRole || Role.USER, []);
  const badge = badges[role];
  return (
    <Badge
      bg={badge.bg}
      {...props}
      className={clsx("shadow p-2", props.className, {
        "rounded-circle": small,
      })}
      style={small ? { lineHeight: 0 } : {}}
      title={badge.title}
    >
      {small ? (
        badge.icon
      ) : (
        <h6 className="m-0">
          {badge.icon} {badge.title}
        </h6>
      )}
    </Badge>
  );
});

export default RoleBadge;
