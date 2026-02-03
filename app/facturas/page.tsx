"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Receipt,
  Calendar,
  Plus,
  AlertCircle,
  CheckCircle2,
  Printer,
} from "lucide-react";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [perfil, setPerfil] = useState<any>(null);
  const [clienteId, setClienteId] = useState("");
  const [monto, setMonto] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  const cargarDatos = async () => {
    // 1. Facturas del usuario
    const { data: fact_data } = await supabase
      .from("facturas")
      .select("*")
      .order("created_at", { ascending: false });
    if (fact_data) setFacturas(fact_data);

    // 2. Clientes activos
    const { data: cli_data } = await supabase
      .from("clientes")
      .select("*")
      .eq("activo", true);
    if (cli_data) setClientes(cli_data);

    // 3. Datos legales (IBAN, NIF...) para el PDF
    const { data: perfil_data } = await supabase
      .from("perfil")
      .select("*")
      .single();
    if (perfil_data) setPerfil(perfil_data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const imprimirFactura = (factura: any) => {
    // Aquí se conectará la lógica de jspdf usando los datos de 'perfil'
    alert(
      `Generando PDF para ${factura.cliente_nombre}. Incluyendo IBAN: ${perfil?.iban || "No configurado"}`,
    );
  };

  const generarFactura = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ texto: "", tipo: "" });

    if (!clienteId || !monto)
      return setMensaje({ texto: "Rellena todos los campos", tipo: "error" });

    const cliente = clientes.find((c) => c.id === clienteId);
    if (!cliente) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("facturas").insert([
      {
        cliente_id: clienteId,
        cliente_nombre: cliente.Nombre || cliente.nombre,
        monto: parseFloat(monto),
        estado: estado,
        user_id: user.id,
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
    const { error } = await supabase
      .from("facturas")
      .update({ estado: "Pagada" })
      .eq("id", id);
    if (!error) {
      setMensaje({ texto: "Cobro registrado correctamente", tipo: "success" });
      cargarDatos();
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">
          Gestión de Facturas
        </h1>
        <p className="text-zinc-500 font-medium mt-1">
          Genera nuevos cobros o actualiza estados en tiempo real.
        </p>
      </header>

      {mensaje.texto && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-2 animate-in fade-in zoom-in duration-300 ${
            mensaje.tipo === "error"
              ? "bg-red-500/10 text-red-500 border border-red-500/20"
              : "bg-green-500/10 text-green-500 border border-green-500/20"
          }`}
        >
          <AlertCircle size={18} />
          <span className="font-bold text-sm">{mensaje.texto}</span>
        </div>
      )}

      {/* FORMULARIO */}
      <form
        onSubmit={generarFactura}
        className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] flex flex-wrap md:flex-nowrap gap-4 items-end shadow-2xl"
      >
        <div className="w-full md:flex-[2] space-y-2">
          <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] ml-2">
            Seleccionar Cliente
          </label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
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
          <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] ml-2">
            Monto (€)
          </label>
          <input
            type="number"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
        <div className="w-full md:flex-1 space-y-2">
          <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] ml-2">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Pagada">Pagada</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white p-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} /> Generar
        </button>
      </form>

      {/* LISTADO */}
      <div className="grid grid-cols-1 gap-3">
        {facturas.map((f) => (
          <div
            key={f.id}
            className="bg-zinc-900 border border-zinc-800 p-5 rounded-[24px] flex flex-col md:flex-row md:items-center justify-between group hover:border-zinc-700 transition-all gap-4"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-2xl ${f.estado === "Pagada" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}
              >
                <Receipt size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  {f.cliente_nombre}
                  {f.estado === "Pagada" && (
                    <CheckCircle2 size={16} className="text-green-500" />
                  )}
                </h3>
                <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                  <Calendar size={12} />{" "}
                  {new Date(f.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-none border-zinc-800 pt-4 md:pt-0">
              {/* BOTONES SOLO PARA PENDIENTES */}
              {f.estado === "Pendiente" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => marcarComoPagada(f.id)}
                    className="text-[10px] bg-green-600 text-white px-4 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-green-500 transition-all shadow-lg shadow-green-900/20"
                  >
                    Cobrar
                  </button>
                  <button
                    onClick={() => imprimirFactura(f)}
                    className="text-[10px] bg-blue-600 text-white px-4 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                  >
                    <Printer size={14} /> Imprimir
                  </button>
                </div>
              )}

              <div className="text-right min-w-[100px]">
                <p className="text-2xl font-black text-white leading-none">
                  {f.monto.toFixed(2)}€
                </p>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest mt-1 ${f.estado === "Pagada" ? "text-green-500" : "text-orange-500"}`}
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
