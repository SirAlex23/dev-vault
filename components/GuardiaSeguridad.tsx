"use client";
import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

export default function GuardiaSeguridad({
  children,
}: {
  children: React.ReactNode;
}) {
  const [autorizado, setAutorizado] = useState(false);
  const [pin, setPin] = useState("");
  const PIN_CORRECTO = "1234"; // 👈 Cambia esto por tu contraseña secreta

  useEffect(() => {
    const sesion = localStorage.getItem("sesion_vault");
    if (sesion === "activa") setAutorizado(true);
  }, []);

  const verificar = () => {
    if (pin === PIN_CORRECTO) {
      localStorage.setItem("sesion_vault", "activa");
      setAutorizado(true);
    } else {
      alert("PIN Incorrecto");
    }
  };

  if (!autorizado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col items-center w-full max-w-sm">
          <Lock className="text-blue-500 mb-4" size={40} />
          <h2 className="text-xl font-bold mb-6">Acceso Protegido</h2>
          <input
            type="password"
            placeholder="Introduce tu PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-center text-2xl tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={verificar}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold transition-all"
          >
            Entrar al Sistema
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
