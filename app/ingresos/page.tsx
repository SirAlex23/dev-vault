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
    // Obtenemos los datos legales de tu empresa desde la tabla perfil
    const { data: miPerfil } = await supabase
      .from("perfil")
      .select("*")
      .single();

    const doc = new jsPDF();

    // Encabezado profesional con tus datos de Ajustes
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(miPerfil?.nombre_empresa || "DEV-VAULT", 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`NIF/CIF: ${miPerfil?.nif_cif || "-"}`, 20, 30);
    doc.text(`Dirección: ${miPerfil?.direccion || "-"}`, 20, 35);
    doc.text(`Email: ${miPerfil?.email_contacto || "-"}`, 20, 40);

    doc.line(20, 45, 190, 45); // Línea divisoria

    // Tabla de contenido
    autoTable(doc, {
      startY: 55,
      head: [["Concepto", "Detalle"]],
      body: [
        ["Cliente", f.cliente_nombre],
        ["Fecha de Operación", new Date(f.created_at).toLocaleDateString()],
        ["Monto Total", `${f.monto.toFixed(2)}€`],
        ["Estado", "PAGADA"],
      ],
      headStyles: { fillColor: [59, 130, 246] }, // Azul profesional
      theme: "striped",
    });

    doc.save(`Factura_${f.cliente_nombre}_${f.id.slice(0, 5)}.pdf`);
  };

  const filtrados = ingresos.filter((i) =>
    i.cliente_nombre?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const totalCobrado = ingresos.reduce((acc, curr) => acc + curr.monto, 0);

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Historial de Ingresos
          </h1>
          <p className="text-zinc-500 text-sm">
            Gestiona y descarga tus facturas pagadas.
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-green-500 p-2 rounded-lg">
            <TrendingUp size={20} className="text-black" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-green-500 tracking-widest">
              Total Cobrado
            </p>
            <p className="text-2xl font-black">{totalCobrado.toFixed(2)}€</p>
          </div>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Buscar cliente para descargar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 pl-12 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {/* CONTENEDOR CON SCROLL PARA MÓVIL */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-zinc-800/50 text-[10px] uppercase text-zinc-500 font-bold tracking-widest">
              <tr>
                <th className="p-6">Cliente</th>
                <th className="p-6 text-center">Fecha de Pago</th>
                <th className="p-6 text-center">Documento</th>
                <th className="p-6 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtrados.map((ingreso) => (
                <tr
                  key={ingreso.id}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="p-6 font-bold text-sm">
                    {ingreso.cliente_nombre}
                  </td>
                  <td className="p-6 text-center text-zinc-400 text-sm">
                    {new Date(ingreso.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-6 text-center">
                    <button
                      onClick={() => descargarPDF(ingreso)}
                      className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-500 transition-all inline-flex items-center gap-2 text-xs font-bold"
                    >
                      <FileDown size={18} /> PDF
                    </button>
                  </td>
                  <td className="p-6 text-right font-black text-lg text-white">
                    {ingreso.monto.toFixed(2)}€
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
