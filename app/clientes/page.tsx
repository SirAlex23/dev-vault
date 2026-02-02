"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserPlus, Trash2, Mail, Users } from "lucide-react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const cargarClientes = async () => {
    setLoading(true);
    // Supabase filtra automáticamente gracias al RLS que activamos en el SQL
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .eq("activo", true)
      .order("created_at", { ascending: false });

    if (data) setClientes(data);
    setLoading(false);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const agregarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email) return;

    // --- SEGURIDAD MULTIUSUARIO ---
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("clientes").insert([
      {
        nombre: nombre, // Asegúrate que en tu tabla se llame 'nombre' o 'Nombre'
        email: email,
        activo: true,
        user_id: user.id, // 👈 Vinculamos al usuario actual
      },
    ]);

    if (!error) {
      setNombre("");
      setEmail("");
      cargarClientes();
    }
  };

  const desactivarCliente = async (id: string) => {
    if (!confirm("¿Estás seguro? Se mantendrá el historial de facturas."))
      return;

    const { error } = await supabase
      .from("clientes")
      .update({ activo: false })
      .eq("id", id);

    if (!error) {
      setClientes(clientes.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">
          Gestión de Clientes
        </h1>
        <p className="text-zinc-500 font-medium">
          Añade o gestiona tus contactos comerciales privados.
        </p>
      </header>

      {/* FORMULARIO */}
      <form
        onSubmit={agregarCliente}
        className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] flex flex-wrap md:flex-nowrap gap-4 items-end shadow-2xl"
      >
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest ml-2">
            Nombre Completo
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Ej: Lukas Pérez"
          />
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] text-zinc-500 uppercase font-black tracking-widest ml-2">
            Email Corporativo
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="lukas@ejemplo.com"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white p-4 px-8 rounded-2xl flex items-center gap-2 font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20 w-full md:w-auto"
        >
          <UserPlus size={20} /> Añadir
        </button>
      </form>

      {/* LISTA DE CLIENTES */}
      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Cargando clientes...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] group hover:border-zinc-700 transition-all relative shadow-lg"
            >
              <button
                onClick={() => desactivarCliente(cliente.id)}
                className="absolute top-6 right-6 text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-xl font-black">
                  {(cliente.nombre || cliente.Nombre)?.[0].toUpperCase() || "?"}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {cliente.nombre || cliente.Nombre || "Sin nombre"}
                  </h3>
                  <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-1 rounded-lg uppercase font-black tracking-wider">
                    Activo
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-zinc-400 bg-black/40 p-4 rounded-2xl border border-zinc-800/50">
                <div className="flex items-center gap-2 truncate">
                  <Mail size={14} className="text-zinc-600" />{" "}
                  {cliente.email || cliente.Email}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {clientes.length === 0 && !loading && (
        <div className="text-center py-24 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[40px] flex flex-col items-center">
          <Users size={48} className="text-zinc-800 mb-4" />
          <p className="text-zinc-500 font-medium">
            No tienes clientes registrados todavía.
          </p>
        </div>
      )}
    </div>
  );
}
