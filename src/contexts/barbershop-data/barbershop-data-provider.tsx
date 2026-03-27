import type { ReactNode } from "react";
import type { BarbershopPageProps } from "../themes/types";
import { BarbershopDataContext } from "./barbershop-data/barbershop-data-context";

interface BarbershopDataProviderProps {
  children: ReactNode;
  value: BarbershopPageProps;
}

export function BarbershopDataProvider({
  children,
  value,
}: BarbershopDataProviderProps) {
  return (
    <BarbershopDataContext.Provider value={value}>
      {children}
    </BarbershopDataContext.Provider>
  );
}
