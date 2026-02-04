"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Receipt,
  Calendar,
  Plus,
  CheckCircle2,
  Printer,
  Loader2,
} from "lucide-react";
import jsPDF from "jspdf";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [perfil, setPerfil] = useState<any>(null);
  const [clienteId, setClienteId] = useState("");
  const [monto, setMonto] = useState("");
  const [estado, setEstado] = useState("Pendiente"); // Estado por defecto
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    const { data: fact_data } = await supabase
      .from("facturas")
      .select("*")
      .order("created_at", { ascending: false });
    if (fact_data) setFacturas(fact_data);

    const { data: cli_data } = await supabase
      .from("clientes")
      .select("*")
      .eq("activo", true);
    if (cli_data) setClientes(cli_data);

    const { data: perfil_data } = await supabase
      .from("perfil")
      .select("*")
      .single();
    if (perfil_data) setPerfil(perfil_data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const descargarPDF = (f: any) => {
    const doc = new jsPDF();

    // Encabezado de Empresa
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(perfil?.nombre_empresa || "MI EMPRESA", 20, 30);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`NIF: ${perfil?.nif_cif || "-"}`, 20, 40);
    doc.text(`Email: ${perfil?.email_contacto || "-"}`, 20, 45);
    doc.text(perfil?.direccion || "-", 20, 50);

    doc.setDrawColor(200);
    doc.line(20, 60, 190, 60);

    // Datos del Cliente y ESTADO de la factura
    doc.setFont("helvetica", "bold");
    doc.text("CLIENTE:", 20, 75);
    doc.text("ESTADO:", 140, 75); // Etiqueta de estado

    doc.setFont("helvetica", "normal");
    doc.text(f.cliente_nombre, 20, 82);

    // Dibujamos el estado (PENDIENTE o PAGADA)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(
      f.estado === "Pagada" ? 34 : 210,
      f.estado === "Pagada" ? 197 : 70,
      f.estado === "Pagada" ? 94 : 45,
    );
    doc.text(f.estado.toUpperCase(), 140, 82);
    doc.setTextColor(0, 0, 0); // Reset color a negro

    // Importe grande
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text(`${f.monto.toFixed(2)}€`, 20, 110);

    // Datos de Pago (IBAN + SWIFT)
    doc.setFontSize(10);
    doc.text("DATOS DE PAGO:", 20, 140);
    doc.setFont("helvetica", "normal");
    doc.text(`IBAN: ${perfil?.iban || "-"}`, 20, 148);
    doc.text(`SWIFT/BIC: ${perfil?.swift_bic || "-"}`, 20, 155); // SWIFT añadido

    doc.save(`Factura_${f.cliente_nombre}_${f.id.slice(0, 5)}.pdf`);
  };

  const generarFactura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !monto) return;
    setCargando(true);

    const cliente = clientes.find((c) => c.id === clienteId);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("facturas").insert([
      {
        cliente_id: clienteId,
        cliente_nombre: cliente.Nombre || cliente.nombre,
        monto: parseFloat(monto),
        estado: estado, // Ahora enviamos el estado seleccionado
        user_id: user?.id,
      },
    ]);

    if (!error) {
      setMonto("");
      setClienteId("");
      setEstado("Pendiente");
      cargarDatos();
    }
    setCargando(false);
  };

  const marcarComoPagada = async (id: string) => {
    await supabase.from("facturas").update({ estado: "Pagada" }).eq("id", id);
    cargarDatos();
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">
          Gestión de Facturas
        </h1>
        <p className="text-zinc-500 font-medium mt-1 uppercase text-xs tracking-widest">
          Genera y controla tus cobros
        </p>
      </header>

      {/* FORMULARIO CORREGIDO CON SELECTOR DE ESTADO */}
      <form
        onSubmit={generarFactura}
        className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] flex flex-wrap md:flex-nowrap gap-4 items-end shadow-2xl transition-all"
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
          disabled={cargando}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white p-4 px-8 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
        >
          {cargando ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Plus size={18} />
          )}
          Generar
        </button>
      </form>

      {/* LISTADO */}
      <div className="grid grid-cols-1 gap-3 pb-24 md:pb-8">
        {facturas.map((f) => (
          <div
            key={f.id}
            className="bg-zinc-900 border border-zinc-800 p-5 rounded-[24px] flex flex-col md:flex-row md:items-center justify-between group gap-4 transition-all hover:border-zinc-700"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-2xl ${f.estado === "Pagada" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}
              >
                <Receipt size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2 italic uppercase tracking-tighter">
                  {f.cliente_nombre}{" "}
                  {f.estado === "Pagada" && (
                    <CheckCircle2 size={16} className="text-green-500" />
                  )}
                </h3>
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12} />{" "}
                  {new Date(f.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-none border-zinc-800 pt-4 md:pt-0">
              {f.estado === "Pendiente" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => marcarComoPagada(f.id)}
                    className="text-[10px] bg-green-600 text-white px-4 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-green-500 transition-all shadow-lg shadow-green-900/20"
                  >
                    Cobrar
                  </button>
                  <button
                    onClick={() => descargarPDF(f)}
                    className="text-[10px] bg-blue-600 text-white px-4 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20"
                  >
                    <Printer size={14} /> Imprimir
                  </button>
                </div>
              )}

              <div className="text-right min-w-[100px]">
                <p className="text-2xl font-black text-white leading-none tracking-tighter">
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
