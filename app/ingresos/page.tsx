"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, FileDown, TrendingUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function IngresosPage() {
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const cargarIngresos = async () => {
    const { data } = await supabase
      .from("facturas")
      .select("*")
      .eq("estado", "Pagada")
      .order("created_at", { ascending: false });
    if (data) setIngresos(data);
  };

  useEffect(() => {
    cargarIngresos();
  }, []);

  const descargarPDF = async (f: any) => {
    const { data: miPerfil } = await supabase
      .from("perfil")
      .select("*")
      .single();
    const doc = new jsPDF();

    // --- DISEÑO DE FRANJA NEGRA ---
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 40, "F");

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(miPerfil?.nombre_empresa?.toUpperCase() || "DEV-VAULT", 20, 25);

    // Datos legales debajo de la franja
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `NIF: ${miPerfil?.nif_cif || "-"} | Dirección: ${miPerfil?.direccion || "-"}`,
      20,
      50,
    );

    autoTable(doc, {
      startY: 60,
      head: [["Concepto", "Detalle"]],
      body: [
        ["Cliente", f.cliente_nombre],
        ["Fecha de Operación", new Date(f.created_at).toLocaleDateString()],
        ["Monto Total", `${f.monto.toFixed(2)}€`],
        ["Estado de Factura", "PAGADA"],
      ],
      headStyles: { fillColor: [15, 15, 15] },
      styles: { cellPadding: 8 },
    });

    doc.save(`Factura_${f.cliente_nombre}.pdf`);
  };

  const totalCobrado = ingresos.reduce((acc, curr) => acc + curr.monto, 0);
  const filtrados = ingresos.filter((i) =>
    i.cliente_nombre?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold italic tracking-tighter uppercase">
            Historial de Ingresos
          </h1>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
            Consulta y descarga tus facturas.
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex items-center gap-4 shadow-xl">
          <div className="bg-green-500 p-2 rounded-xl text-black">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
              Balance Total
            </p>
            <p className="text-2xl font-black italic">
              {totalCobrado.toFixed(2)}€
            </p>
          </div>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-4 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-zinc-800/50 text-[10px] uppercase text-zinc-500 font-bold tracking-widest">
              <tr>
                <th className="p-6">Cliente</th>
                <th className="p-6 text-center">Fecha</th>
                <th className="p-6 text-center">Documento</th>
                <th className="p-6 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtrados.map((i) => (
                <tr
                  key={i.id}
                  className="hover:bg-zinc-800/30 transition-colors group"
                >
                  <td className="p-6 font-bold italic uppercase tracking-tight">
                    {i.cliente_nombre}
                  </td>
                  <td className="p-6 text-center text-zinc-400 font-medium">
                    {new Date(i.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-6 text-center">
                    <button
                      onClick={() => descargarPDF(i)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-transparent hover:border-blue-500/20"
                    >
                      <FileDown size={18} /> PDF
                    </button>
                  </td>
                  <td className="p-6 text-right font-black text-lg italic">
                    {i.monto.toFixed(2)}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
