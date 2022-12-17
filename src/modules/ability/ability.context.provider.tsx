import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { AbilityContext, buildAbilityFor } from "./ability";

interface AbilityContextProviderProps {
  children: React.ReactNode;
}

const AbilityContextProvider: React.FC<AbilityContextProviderProps> =
  React.memo(function f({ children }: AbilityContextProviderProps) {
    const { user } = useSelector((state: RootState) => state.auth);
    const ability = React.useMemo(() => buildAbilityFor(user), [user]);
    return (
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    );
  });

export default AbilityContextProvider;
