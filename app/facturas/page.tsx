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
  Loader2,
} from "lucide-react";
import jsPDF from "jspdf"; // Asegúrate de tenerlo instalado

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [perfil, setPerfil] = useState<any>(null);
  const [clienteId, setClienteId] = useState("");
  const [monto, setMonto] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

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

    // Configuración estética del PDF
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

    doc.setFont("helvetica", "bold");
    doc.text("CLIENTE:", 20, 75);
    doc.setFont("helvetica", "normal");
    doc.text(f.cliente_nombre, 20, 82);

    doc.setFont("helvetica", "bold");
    doc.text("ESTADO:", 140, 75);
    doc.text(f.estado.toUpperCase(), 140, 82);

    doc.setFontSize(30);
    doc.text(`${f.monto.toFixed(2)}€`, 20, 110);

    // DATOS BANCARIOS (Lo que acabas de configurar)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("MÉTODO DE PAGO:", 20, 140);
    doc.setFont("helvetica", "normal");
    doc.text(`IBAN: ${perfil?.iban || "Consultar"}`, 20, 148);
    doc.text(`SWIFT/BIC: ${perfil?.swift_bic || "-"}`, 20, 154);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Documento generado el ${new Date().toLocaleDateString()}`,
      20,
      280,
    );

    doc.save(`Factura_${f.cliente_nombre}_${f.id.slice(0, 5)}.pdf`);
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

  const generarFactura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !monto) return;
    const cliente = clientes.find((c) => c.id === clienteId);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("facturas").insert([
      {
        cliente_id: clienteId,
        cliente_nombre: cliente.Nombre || cliente.nombre,
        monto: parseFloat(monto),
        estado: estado,
        user_id: user?.id,
      },
    ]);

    if (!error) {
      setMonto("");
      setClienteId("");
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
          Imprime pendientes o marca cobros.
        </p>
      </header>

      {/* FORMULARIO ESTILO CÁPSULA */}
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
            className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
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
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white p-4 px-8 rounded-2xl font-black uppercase tracking-widest transition-all"
        >
          + Generar
        </button>
      </form>

      {/* LISTADO */}
      <div className="grid grid-cols-1 gap-3">
        {facturas.map((f) => (
          <div
            key={f.id}
            className="bg-zinc-900 border border-zinc-800 p-5 rounded-[24px] flex flex-col md:flex-row md:items-center justify-between group gap-4"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-2xl ${f.estado === "Pagada" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}
              >
                <Receipt size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  {f.cliente_nombre}{" "}
                  {f.estado === "Pagada" && (
                    <CheckCircle2 size={16} className="text-green-500" />
                  )}
                </h3>
                <span className="text-xs text-zinc-500 font-medium italic">
                  <Calendar size={12} className="inline mr-1" />{" "}
                  {new Date(f.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-none border-zinc-800 pt-4 md:pt-0">
              {f.estado === "Pendiente" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => marcarComoPagada(f.id)}
                    className="text-[10px] bg-green-600/20 text-green-500 border border-green-500/30 px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all"
                  >
                    Cobrar
                  </button>
                  <button
                    onClick={() => descargarPDF(f)}
                    className="text-[10px] bg-blue-600 text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2"
                  >
                    <Printer size={14} /> Imprimir
                  </button>
                </div>
              )}

              <div className="text-right min-w-[100px]">
                <p className="text-2xl font-black text-white">
                  {f.monto.toFixed(2)}€
                </p>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${f.estado === "Pagada" ? "text-green-500" : "text-orange-500"}`}
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
