import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans transition-colors duration-300">
      <main className="flex-1 overflow-y-auto pb-20 max-w-md mx-auto w-full border-x border-border shadow-2xl bg-background min-h-screen">
        <Outlet />
      </main>
      <div className="max-w-md mx-auto w-full">
        <BottomNav />
      </div>
    </div>
  );
}
