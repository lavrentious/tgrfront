import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from "@casl/ability";
import { createContext } from "react";
import { Record } from "src/modules/records/models/record.model";
import { Role, User } from "src/modules/users/models/user.model";
import { StoredUser } from "src/store/auth.reducer";

type Action = "manage" | "create" | "read" | "update" | "delete";
type Subjects = InferSubjects<typeof User | typeof Record> | "all";
export type AppAbility = Ability<[Action, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

type FlatRecord = Record & {
  "author._id": Record["author"]["_id"];
};

export default function defineRulesFor(user: StoredUser | null) {
  const { can, rules } = new AbilityBuilder(AppAbility);

  const defineForAnon = () => {
    can("read", Record);
    can("read", User, ["username", "name", "role"]);
  };

  defineForAnon();
  if (!user) return rules;

  const defineForUser = () => {
    can("read", User, { _id: user.id });
    can("update", User, ["username", "name", "email", "password"], {
      _id: user.id,
    });
    // TODO: store emailConfirmed in redux; verification requests module
    // if (user.emailConfirmed) {
    // can('create', 'VerificationRequest');
    // can(['delete', 'read'], 'VerificationRequest', { userId: user._id });
    // }
  };
  const defineForVerified = () => {
    can("create", Record);
    can<FlatRecord>("delete", Record, { "author._id": user.id });
    can<FlatRecord>(
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
      }
    );
    can("read", User, ["createdAt"]);
    // cannot('create', 'VerificationRequest');
  };
  const defineForModerator = () => {
    can("read", User);
    can("update", User, ["role"], { role: Role.USER });
    // can(['read', 'delete'], 'VerificationRequest');
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
  return new AppAbility(defineRulesFor(user), {
    detectSubjectType: (object) =>
      object.constructor as ExtractSubjectType<Subjects>,
  });
}

export const AbilityContext = createContext<AppAbility>(buildAbilityFor(null));
