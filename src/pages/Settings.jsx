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
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || 'indigo';
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

  const changeAccentColor = (colorName, colorValue) => {
    setAccentColor(colorName);
    document.documentElement.style.setProperty('--primary', colorValue);
    localStorage.setItem('accentColor', colorName);
    localStorage.setItem('accentColorValue', colorValue);
  };

  useEffect(() => {
    // Ensure the saved accent color is applied
    const savedColorValue = localStorage.getItem('accentColorValue');
    if (savedColorValue) {
      document.documentElement.style.setProperty('--primary', savedColorValue);
    }
  }, []);

  const handleLogout = () => {
    // Clean up if needed, then reload to reset auth state
    window.location.reload();
  };

  return (
    <div className="p-4 space-y-6">
      <header className="py-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Ajustes da conta e aplicativo</p>
      </header>

      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xs uppercase font-bold tracking-wider text-muted-foreground pl-1">Preferências</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-0 divide-y divide-border">
              <div 
                onClick={toggleTheme}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 text-card-foreground font-medium">
                  {isDark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  Tema Escuro
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${isDark ? 'bg-primary' : 'bg-muted-foreground'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isDark ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3 text-card-foreground font-medium">
                  <PaintBucket className="w-5 h-5 text-muted-foreground" />
                  Cor de Destaque
                </div>
                <div className="flex gap-4 pt-2">
                  <div 
                    onClick={() => changeAccentColor('indigo', 'oklch(0.511 0.262 276.966)')}
                    className={`w-8 h-8 rounded-full bg-[#6366f1] cursor-pointer transition-all ${accentColor === 'indigo' ? 'ring-4 ring-[#6366f1]/30 ring-offset-2 ring-offset-background' : 'opacity-50 hover:opacity-100'}`}
                  ></div>
                  <div 
                    onClick={() => changeAccentColor('emerald', 'oklch(0.627 0.194 149.214)')}
                    className={`w-8 h-8 rounded-full bg-[#10b981] cursor-pointer transition-all ${accentColor === 'emerald' ? 'ring-4 ring-[#10b981]/30 ring-offset-2 ring-offset-background' : 'opacity-50 hover:opacity-100'}`}
                  ></div>
                  <div 
                    onClick={() => changeAccentColor('rose', 'oklch(0.645 0.246 16.439)')}
                    className={`w-8 h-8 rounded-full bg-[#f43f5e] cursor-pointer transition-all ${accentColor === 'rose' ? 'ring-4 ring-[#f43f5e]/30 ring-offset-2 ring-offset-background' : 'opacity-50 hover:opacity-100'}`}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs uppercase font-bold tracking-wider text-muted-foreground pl-1">Conta</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-0 divide-y divide-border">
              <div 
                onClick={handleLogout}
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors text-red-500 font-medium"
              >
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
