import { NavLink } from "react-router-dom";
import { Home, PlusCircle, History, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

export function BottomNav() {
  const navItems = [
    { icon: Home, label: "Início", path: "/" },
    { icon: PlusCircle, label: "Novo", path: "/new" },
    { icon: History, label: "Histórico", path: "/history" },
    { icon: Settings, label: "Config", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              isActive ? "text-indigo-500" : "text-zinc-500 hover:text-zinc-300"
            )
          }
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
