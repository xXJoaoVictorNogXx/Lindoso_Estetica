import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { PaintBucket, Moon, Sun, ShieldCheck, LogOut } from "lucide-react";

export function Settings() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  };

  return (
    <div className="p-4 space-y-6">
      <header className="py-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Configurações</h1>
        <p className="text-sm text-zinc-400">Ajustes da conta e aplicativo</p>
      </header>

      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xs uppercase font-bold tracking-wider text-zinc-500 pl-1">Preferências</h2>
          <Card>
            <CardContent className="p-0 divide-y divide-zinc-800">
              <div 
                onClick={toggleTheme}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 text-zinc-200 font-medium">
                  {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                  Tema Escuro
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${isDark ? 'bg-indigo-600' : 'bg-zinc-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isDark ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3 text-zinc-200 font-medium">
                  <PaintBucket className="w-5 h-5 text-zinc-400" />
                  Cor de Destaque
                </div>
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 ring-2 ring-white ring-offset-2 ring-offset-zinc-900"></div>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 opacity-50"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs uppercase font-bold tracking-wider text-zinc-500 pl-1">Conta</h2>
          <Card>
            <CardContent className="p-0 divide-y divide-zinc-800">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3 text-zinc-200 font-medium">
                  <ShieldCheck className="w-5 h-5 text-zinc-400" />
                  Assinatura PRO
                </div>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">ATIVO</span>
              </div>
              <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors text-red-400 font-medium">
                <LogOut className="w-5 h-5" />
                Sair da Conta
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
