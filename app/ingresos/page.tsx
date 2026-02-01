"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Search,
  DollarSign,
  Calendar,
  User,
  ArrowUpRight,
  FileDown,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function IngresosPage() {
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [totalHistorico, setTotalHistorico] = useState(0);

  const cargarIngresos = async () => {
    const { data } = await supabase
      .from("facturas")
      .select("*")
      .eq("estado", "Pagada")
      .order("created_at", { ascending: false });

    if (data) {
      setIngresos(data);
      const suma = data.reduce(
        (acc, curr) => acc + (Number(curr.monto) || 0),
        0,
      );
      setTotalHistorico(suma);
    }
  };

  useEffect(() => {
    cargarIngresos();
  }, []);

  const descargarPDF = (f: any) => {
    const doc = new jsPDF();

    // Encabezado Estilo Dev-Vault
    doc.setFillColor(24, 24, 27);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("DEV-VAULT", 20, 25);
    doc.setFontSize(10);
    doc.text("CONTROL FINANCIERO PROFESIONAL", 20, 32);

    // Datos de la factura
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Nº FACTURA: ${f.id.slice(0, 8).toUpperCase()}`, 20, 60);
    doc.text(`FECHA: ${new Date(f.created_at).toLocaleDateString()}`, 20, 68);
    doc.text(`CLIENTE: ${f.cliente_nombre}`, 20, 76);
    doc.text(`ESTADO: PAGADA`, 20, 84);

    // Tabla de Conceptos
    autoTable(doc, {
      startY: 95,
      head: [["Descripción", "Cantidad", "Precio Unitario", "Total"]],
      body: [
        [
          "Servicios de Desarrollo / Consultoría",
          "1",
          `${f.monto}€`,
          `${f.monto}€`,
        ],
      ],
      headStyles: { fillColor: [59, 130, 246] },
      theme: "grid",
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.text(`TOTAL COBRADO: ${f.monto}€`, 140, finalY + 20);
    doc.save(`Factura_${f.cliente_nombre}.pdf`);
  };

  const ingresosFiltrados = ingresos.filter((i) =>
    i.cliente_nombre?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen text-white">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Historial de Ingresos</h1>
          <p className="text-zinc-500">
            Busca clientes y descarga sus facturas pagadas.
          </p>
        </div>
        <div className="text-right bg-green-500/10 border border-green-500/20 p-4 rounded-2xl">
          <p className="text-xs text-green-500 font-bold uppercase tracking-widest">
            Total Cobrado
          </p>
          <p className="text-3xl font-black text-white">{totalHistorico}€</p>
        </div>
      </header>

      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar cliente para descargar factura..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase font-bold tracking-widest">
              <th className="p-6">Cliente</th>
              <th className="p-6">Fecha de Pago</th>
              <th className="p-6 text-center">Documento</th>
              <th className="p-6 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {ingresosFiltrados.map((ingreso) => (
              <tr
                key={ingreso.id}
                className="hover:bg-zinc-800/50 transition-colors group"
              >
                <td className="p-6 font-bold text-white">
                  {ingreso.cliente_nombre}
                </td>
                <td className="p-6 text-zinc-400">
                  {new Date(ingreso.created_at).toLocaleDateString()}
                </td>
                <td className="p-6 text-center">
                  <button
                    onClick={() => descargarPDF(ingreso)}
                    className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-xl transition-all"
                    title="Descargar PDF"
                  >
                    <FileDown size={20} className="mx-auto" />
                  </button>
                </td>
                <td className="p-6 text-right font-black text-xl text-white">
                  {ingreso.monto}€
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
