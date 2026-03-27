import type { ReactNode } from "react";
import type { StyleContextType } from "./style-context";
import { StyleContext } from "./style-context";

export function StyleProvider({
  primaryColor,
  textButtonColor,
  children,
}: StyleContextType & { children: ReactNode }) {
  return (
    <StyleContext.Provider value={{ primaryColor, textButtonColor }}>
      {children}
    </StyleContext.Provider>
  );
}
