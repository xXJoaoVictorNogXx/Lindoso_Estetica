import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Droplets, Mail, Lock, LogIn } from "lucide-react";

export function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login for now. The real DB logic (Firebase/Supabase) will go here.
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-md pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Lindoso Estética</h1>
          <p className="text-zinc-400 mt-2">Faça login para acessar o sistema</p>
        </div>

        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Acessar Conta</CardTitle>
            <CardDescription className="text-zinc-400">
              Digite suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <Input 
                    type="email" 
                    placeholder="E-mail" 
                    className="pl-10 bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <Input 
                    type="password" 
                    placeholder="Senha" 
                    className="pl-10 bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                  <input type="checkbox" className="rounded border-zinc-800 bg-zinc-950 text-indigo-500 focus:ring-indigo-500/20" />
                  Lembrar de mim
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>

              <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white mt-2">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Não tem uma conta? <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}
