import { Logo } from "../components/logo";
import { DataDeletionMain } from "../components/main/data-deletion-main";

export function DataDeletionPage() {
  return (
    <>
      <div className="flex w-full items-center justify-center py-4">
        <Logo isDarkLogo={false} />
      </div>
      <DataDeletionMain />
    </>
  );
}
