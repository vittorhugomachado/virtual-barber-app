import { createContext, useContext } from "react";

export interface StyleContextType {
  primaryColor: string;
  textButtonColor: string;
}

export const StyleContext = createContext<StyleContextType>({
  primaryColor: "#0458EE",
  textButtonColor: "#000000",
});

export function useStyle() {
  return useContext(StyleContext);
}
