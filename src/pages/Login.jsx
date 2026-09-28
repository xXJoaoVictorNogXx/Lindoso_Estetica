import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Droplets, Mail, Lock, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
export function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-md pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <Droplets className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Lindoso Estética</h1>
          <p className="text-muted-foreground mt-2">Faça login para acessar o sistema</p>
        </div>

        <Card className="bg-card/50 border-border/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-card-foreground">Acessar Conta</CardTitle>
            <CardDescription className="text-muted-foreground">
              Digite suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="E-mail" 
                    className="pl-10 bg-background/50 border-border focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="Senha" 
                    className="pl-10 bg-background/50 border-border focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-border bg-background text-primary focus:ring-primary/20" />
                  Lembrar de mim
                </label>
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Não tem uma conta? <a href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}
