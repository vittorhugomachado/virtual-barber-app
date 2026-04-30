import type { ReactNode } from "react";
import type { StoreStyle } from "@/app/themes/types";
import { StyleContext } from "./style-context";

export function StyleProvider({
  style,
  isDarkBackground,
  children,
}: {
  style: StoreStyle;
  isDarkBackground: boolean;
  children: ReactNode;
}) {
  return (
    <StyleContext.Provider value={{ style, isDarkBackground }}>
      {children}
    </StyleContext.Provider>
  );
}
