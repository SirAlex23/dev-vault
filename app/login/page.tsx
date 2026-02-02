"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        // Registro de nuevo usuario
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // Si no hay error y tienes 'Confirm Email' desactivado en Supabase,
        // el usuario ya tiene sesión activa automáticamente.
        alert("¡Cuenta creada con éxito!");
        router.push("/panel");
      } else {
        // Inicio de sesión
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Redirigir al panel tras login exitoso
        router.push("/panel");
      }
    } catch (error: any) {
      alert(error.message || "Ocurrió un error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* CARD PRINCIPAL */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-10 rounded-[40px] shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        {/* LOGO Y TÍTULO */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white italic tracking-tighter">
            DEV<span className="text-blue-500">-VAULT</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">
            {isRegister ? "Crea tu cuenta profesional" : "Bienvenido de nuevo"}
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative group">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="email"
              placeholder="Email corporativo"
              className="w-full bg-black border border-zinc-800 rounded-2xl p-4 pl-12 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="password"
              placeholder="Contraseña (mín. 6 caracteres)"
              className="w-full bg-black border border-zinc-800 rounded-2xl p-4 pl-12 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-900/20 uppercase tracking-widest text-sm mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isRegister ? "Registrarse" : "Iniciar Sesión"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* SWITCHER REGISTRO/LOGIN */}
        <div className="text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-zinc-500 text-xs font-bold hover:text-white transition-colors uppercase tracking-widest"
          >
            {isRegister
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta aún? Regístrate gratis"}
          </button>
        </div>
      </div>
    </div>
  );
}
