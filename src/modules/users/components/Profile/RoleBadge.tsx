import clsx from "clsx";
import React from "react";
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
}

const RoleBadge: React.FC<IRoleBadgeProps> = React.memo(function RoleBadge({
  role,
  ...props
}: IRoleBadgeProps) {
  return (
    <Badge
      bg={badges[role]?.bg ?? badges[Role.USER].bg}
      {...props}
      className={clsx("shadow p-2", props.className)}
    >
      <h6 className="m-0">
        {badges[role]?.icon ?? badges[Role.USER].icon}{" "}
        {badges[role]?.title ?? badges[Role.USER].title}
      </h6>
    </Badge>
  );
});

export default RoleBadge;
