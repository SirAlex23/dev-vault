"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Receipt,
  Calendar,
  Plus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [monto, setMonto] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  const cargarDatos = async () => {
    // Obtenemos todas las facturas ordenadas por fecha
    const { data: fact_data } = await supabase
      .from("facturas")
      .select("*")
      .order("created_at", { ascending: false });
    if (fact_data) setFacturas(fact_data);

    // Obtenemos solo los clientes activos para el desplegable
    const { data: cli_data } = await supabase
      .from("clientes")
      .select("*")
      .eq("activo", true);
    if (cli_data) setClientes(cli_data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const generarFactura = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ texto: "", tipo: "" });

    if (!clienteId || !monto)
      return setMensaje({ texto: "Rellena todos los campos", tipo: "error" });

    const cliente = clientes.find((c) => c.id === clienteId);
    if (!cliente) return;

    // Insertamos la nueva factura con los nombres de columna en minúsculas
    const { error } = await supabase.from("facturas").insert([
      {
        cliente_id: clienteId,
        cliente_nombre: cliente.Nombre || cliente.nombre,
        monto: parseFloat(monto),
        estado: estado,
      },
    ]);

    if (error) {
      setMensaje({ texto: "Error: " + error.message, tipo: "error" });
    } else {
      setMensaje({ texto: "¡Factura creada con éxito!", tipo: "success" });
      setMonto("");
      setClienteId("");
      cargarDatos();
    }
  };

  const marcarComoPagada = async (id: string) => {
    // Actualizamos el estado a 'Pagada'
    const { error } = await supabase
      .from("facturas")
      .update({ estado: "Pagada" })
      .eq("id", id);
    if (!error) cargarDatos();
  };

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen text-white">
      <header>
        <h1 className="text-3xl font-bold">Gestión de Facturas</h1>
        <p className="text-zinc-500 font-medium mt-1">
          Genera nuevos cobros o actualiza estados en tiempo real.
        </p>
      </header>

      {mensaje.texto && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2 ${mensaje.tipo === "error" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-green-500/10 text-green-500 border border-green-500/20"}`}
        >
          <AlertCircle size={18} />
          <span className="font-bold text-sm">{mensaje.texto}</span>
        </div>
      )}

      {/* FORMULARIO DE CREACIÓN */}
      <form
        onSubmit={generarFactura}
        className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-wrap md:flex-nowrap gap-4 items-end shadow-lg"
      >
        <div className="w-full md:flex-[2] space-y-2">
          <label className="text-xs text-zinc-500 uppercase font-bold tracking-widest">
            Seleccionar Cliente
          </label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="">Elegir cliente...</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.Nombre || c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:flex-1 space-y-2">
          <label className="text-xs text-zinc-500 uppercase font-bold tracking-widest">
            Monto (€)
          </label>
          <input
            type="number"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
        <div className="w-full md:flex-1 space-y-2">
          <label className="text-xs text-zinc-500 uppercase font-bold tracking-widest">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Pagada">Pagada</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white p-3 px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-900/20"
        >
          <Plus size={18} /> Generar Factura
        </button>
      </form>

      {/* LISTADO DE FACTURAS */}
      <div className="space-y-3">
        {facturas.map((f) => (
          <div
            key={f.id}
            className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between group hover:border-zinc-700 transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${f.estado === "Pagada" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}
              >
                <Receipt size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold flex items-center gap-2">
                  {f.cliente_nombre}
                  {f.estado === "Pagada" && (
                    <CheckCircle2 size={14} className="text-green-500" />
                  )}
                </h3>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Calendar size={12} />{" "}
                  {new Date(f.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {f.estado === "Pendiente" && (
                <button
                  onClick={() => marcarComoPagada(f.id)}
                  className="text-[10px] bg-green-600/20 text-green-500 px-4 py-2 rounded-lg font-black uppercase tracking-wider transition-all hover:bg-green-600 hover:text-white"
                >
                  Cobrar Factura
                </button>
              )}

              <div className="text-right min-w-[100px]">
                <p className="text-xl font-black text-white">{f.monto}€</p>
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest ${f.estado === "Pagada" ? "text-green-500" : "text-orange-500"}`}
                >
                  {f.estado}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
