import {
  AbilityBuilder,
  createMongoAbility,
  type ExtractSubjectType,
  type InferSubjects,
  type MongoAbility,
} from "@casl/ability";
import { createContext } from "react";
import { Record } from "src/modules/records/models/record.model";
import { Role, User } from "src/modules/users/models/user.model";
import type { StoredUser } from "src/store/auth.reducer";

type Action = "manage" | "create" | "read" | "update" | "delete";
type Subjects = InferSubjects<typeof User | typeof Record> | "all";
export type AppAbility = MongoAbility<[Action, Subjects]>;

export default function defineRulesFor(user: StoredUser | null) {
  const { can, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);

  const defineForAnon = () => {
    can("read", Record);
    can("read", User, ["_id", "username", "role"]);
  };

  defineForAnon();
  if (!user) return rules;

  const defineForUser = () => {
    can("read", User, { _id: user.id });
    can("update", User, ["username", "name", "email"], {
      _id: user.id,
    });
  };
  const defineForVerified = () => {
    can("create", Record);
    can("delete", Record, { "author._id": user.id });
    can(
      "update",
      Record,
      [
        "name",
        "description",
        "accessibility",
        "address",
        "lat",
        "lon",
        "type",
        "photos",
      ],
      {
        "author._id": user.id,
      },
    );
    can("read", User, ["name", "email", "emailConfirmed", "createdAt"]);
  };
  const defineForModerator = () => {
    can("read", User, "updatedAt");
    can("update", User, ["role"], { role: Role.USER });
  };
  const defineForAdmin = () => {
    can("manage", "all");
  };

  switch (user.role) {
    case Role.ADMIN:
      defineForAdmin();
      break;
    case Role.MODERATOR:
      defineForUser();
      defineForVerified();
      defineForModerator();
      break;
    case Role.VERIFIED:
      defineForUser();
      defineForVerified();
      break;
    case Role.USER:
      defineForUser();
      break;
    default:
      break;
  }

  return rules;
}

export function buildAbilityFor(user: StoredUser | null): AppAbility {
  return createMongoAbility(defineRulesFor(user), {
    detectSubjectType: (object) =>
      object.constructor as ExtractSubjectType<Subjects>,
  });
}

export const AbilityContext = createContext<AppAbility>(buildAbilityFor(null));
