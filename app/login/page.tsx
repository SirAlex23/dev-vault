"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Mail, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales incorrectas. Revisa tu email o contraseña.");
    } else {
      router.push("/"); // Si todo sale bien, volvemos al Panel principal
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 border border-zinc-800 p-10 rounded-3xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Dev-Vault</h2>
          <p className="mt-2 text-zinc-400">
            Introduce tus credenciales para acceder
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={manejarLogin}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 pl-10 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="tu@email.com"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 pl-10 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
          >
            <LogIn size={20} /> Entrar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}
