import { Suspense } from "react";
import PrototypeWorkbench from "./prototype-workbench";

export const metadata = {
  title: "Prototype - Tianmao Global AI Service Workbench",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 p-6 text-sm text-slate-100">
          Loading prototype...
        </main>
      }
    >
      <PrototypeWorkbench />
    </Suspense>
  );
}
