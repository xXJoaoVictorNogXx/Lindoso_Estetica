import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 font-sans">
      <main className="flex-1 overflow-y-auto pb-20 max-w-md mx-auto w-full border-x border-zinc-900 shadow-2xl bg-zinc-950 min-h-screen">
        <Outlet />
      </main>
      <div className="max-w-md mx-auto w-full">
        <BottomNav />
      </div>
    </div>
  );
}
