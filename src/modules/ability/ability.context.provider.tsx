import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "src/store";
import { AbilityContext, buildAbilityFor } from "./ability";

interface AbilityContextProviderProps {
  children: React.ReactNode;
}

const AbilityContextProvider: React.FC<AbilityContextProviderProps> = ({
  children,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const ability = useMemo(() => buildAbilityFor(user), [user]);
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export default AbilityContextProvider;
