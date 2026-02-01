"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserPlus, Trash2, Mail } from "lucide-react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Cargar clientes con protección de datos
  const cargarClientes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .eq("activo", true)
      .order("created_at", { ascending: false });

    if (data) {
      setClientes(data);
    } else {
      setClientes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const agregarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email) return;

    const { error } = await supabase
      .from("clientes")
      .insert([{ nombre, email, activo: true }]);

    if (!error) {
      setNombre("");
      setEmail("");
      cargarClientes();
    }
  };

  const desactivarCliente = async (id: string) => {
    const confirmacion = confirm(
      "¿Estás seguro? Se mantendrá el historial de facturas.",
    );
    if (!confirmacion) return;

    const { error } = await supabase
      .from("clientes")
      .update({ activo: false })
      .eq("id", id);

    if (!error) {
      setClientes(clientes.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Gestión de Clientes</h1>
        <p className="text-zinc-400">
          Añade o gestiona tus contactos comerciales.
        </p>
      </div>

      {/* FORMULARIO */}
      <form
        onSubmit={agregarCliente}
        className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex gap-4 items-end shadow-xl"
      >
        <div className="flex-1 space-y-2">
          <label className="text-xs text-zinc-500 uppercase font-bold">
            Nombre Completo
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Lukas Pérez"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-xs text-zinc-500 uppercase font-bold">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="lukas@ejemplo.com"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white p-3 px-6 rounded-xl flex items-center gap-2 font-bold transition-all"
        >
          <UserPlus size={20} /> Añadir
        </button>
      </form>

      {/* LISTA DE CLIENTES */}
      {loading ? (
        <p className="text-zinc-500">Cargando clientes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl group hover:border-zinc-700 transition-all relative"
            >
              <button
                onClick={() => desactivarCliente(cliente.id)}
                className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
              <div className="flex items-center gap-4 mb-4">
                {/* SOLUCIÓN AL ERROR DE CONSOLA: Validación con ? y fallback */}
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xl font-bold">
                  {cliente.Nombre ? cliente.Nombre[0].toUpperCase() : "?"}
                </div>
                <div>
                  <h3 className="text-white font-bold">
                    {cliente.Nombre || "Sin nombre"}
                  </h3>
                  <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full uppercase font-black">
                    Activo
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2 truncate">
                  <Mail size={14} className="shrink-0" /> {cliente.Email}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {clientes.length === 0 && !loading && (
        <div className="text-center py-20 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl">
          <p className="text-zinc-500">
            No hay clientes activos en este momento.
          </p>
        </div>
      )}
    </div>
  );
}
