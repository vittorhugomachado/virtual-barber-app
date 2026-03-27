import { createContext, useContext } from "react";
import type { BarbershopPageProps } from "../../themes/types";

export const BarbershopDataContext = createContext<BarbershopPageProps | null>(
  null,
);

export function useBarbershopData() {
  const context = useContext(BarbershopDataContext);

  if (!context) {
    throw new Error(
      "useBarbershopData must be used within a BarbershopDataProvider",
    );
  }

  return context;
}
