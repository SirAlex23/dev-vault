"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  User,
  DollarSign,
  Shield,
  Bell,
  ChevronRight,
  Save,
  X,
} from "lucide-react";

export default function AjustesPage() {
  const [perfil, setPerfil] = useState<any>(null);
  const [editando, setEditando] = useState<string | null>(null); // 'perfil' o 'saldo'
  const [nombre, setNombre] = useState("");
  const [saldo, setSaldo] = useState("");

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from("perfiles").select("*").single();
      if (data) {
        setPerfil(data);
        setNombre(data.Nombre);
        setSaldo(data.Ingresos_Totales.toString());
      }
    }
    cargar();
  }, []);

  const actualizar = async () => {
    const { error } = await supabase
      .from("perfiles")
      .update({ Nombre: nombre, Ingresos_Totales: parseInt(saldo) })
      .eq("id", perfil.id);

    if (!error) {
      setEditando(null);
      window.location.reload(); // Para refrescar los datos globales
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Configuración</h1>
        <p className="text-zinc-400">
          Administra las preferencias de tu cuenta y negocio.
        </p>
      </div>

      <div className="space-y-4">
        {/* OPCIÓN: PERFIL */}
        <button
          onClick={() => setEditando("perfil")}
          className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between hover:bg-zinc-800/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <User />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Información Personal</p>
              <p className="text-zinc-500 text-sm">
                Cambia tu nombre público: {perfil?.Nombre}
              </p>
            </div>
          </div>
          <ChevronRight className="text-zinc-600 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* OPCIÓN: FINANZAS */}
        <button
          onClick={() => setEditando("saldo")}
          className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between hover:bg-zinc-800/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <DollarSign />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Ajustes Financieros</p>
              <p className="text-zinc-500 text-sm">
                Tu saldo base actual es de {perfil?.Ingresos_Totales}€
              </p>
            </div>
          </div>
          <ChevronRight className="text-zinc-600 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* OPCIÓN: SEGURIDAD (BLOQUEADA POR AHORA) */}
        <div className="w-full bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl flex items-center justify-between opacity-60">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-800 rounded-xl text-zinc-500">
              <Shield />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Seguridad y Acceso</p>
              <p className="text-zinc-500 text-sm">
                Próximamente: Cambiar contraseña y 2FA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE EDICIÓN (Simple y efectivo) */}
      {editando && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Editar {editando === "perfil" ? "Perfil" : "Saldo"}
              </h2>
              <button
                onClick={() => setEditando(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X />
              </button>
            </div>

            {editando === "perfil" ? (
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-4 text-white mb-6 outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                type="number"
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
                className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-4 text-white mb-6 outline-none focus:ring-2 focus:ring-green-500"
              />
            )}

            <button
              onClick={actualizar}
              className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
            >
              <Save size={20} /> Guardar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
