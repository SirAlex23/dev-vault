"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (!error) alert("¡Revisa tu email para confirmar!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error) router.push("/");
      else alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Dev<span className="text-blue-500">-Vault</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            {isRegister ? "Crea tu cuenta profesional" : "Bienvenido de nuevo"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-zinc-600" size={18} />
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full bg-black border border-zinc-800 rounded-2xl p-4 pl-12 text-white outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-zinc-600" size={18} />
            <input
              type="password"
              placeholder="Contraseña"
              required
              className="w-full bg-black border border-zinc-800 rounded-2xl p-4 pl-12 text-white outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
            {isRegister ? "Registrarse" : "Entrar al Panel"}{" "}
            <ArrowRight size={18} />
          </button>
        </form>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full text-zinc-500 text-sm hover:text-white transition-colors"
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate gratis"}
        </button>
      </div>
    </div>
  );
}
