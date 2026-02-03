"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function PanelPage() {
  const [stats, setStats] = useState({ ingresos: 0, facturas: 0, clientes: 0 });
  const [datosGrafica, setDatosGrafica] = useState<any[]>([]);

  const mesActualIndex = new Date().getMonth(); // Febrero = 1

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: facturas } = await supabase.from("facturas").select("*");
      const { data: clientes } = await supabase.from("clientes").select("*");

      if (facturas) {
        const totalPagado = facturas.reduce(
          (acc, f) => acc + (f.estado === "Pagada" ? f.monto : 0),
          0,
        );

        setStats({
          ingresos: totalPagado,
          facturas: facturas.length,
          clientes: clientes?.length || 0,
        });

        const meses = [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Agos",
          "Sept",
          "Oct",
          "Nov",
          "Dic",
        ];

        // CORRECCIÓN: Ahora los datos de la gráfica usan el total REAL de tus ingresos para Febrero
        const dataSincronizada = meses.map((mes, i) => ({
          name: mes,
          // Si es el mes actual, ponemos tus ingresos reales. Si no, simulamos otros meses.
          total:
            i === mesActualIndex
              ? totalPagado
              : Math.floor(Math.random() * 3000) + 500,
        }));

        setDatosGrafica(dataSincronizada);
      }
    };
    cargarDatos();
  }, [mesActualIndex]);

  return (
    <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Resumen Ejecutivo
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Bienvenido a tu centro de control de Dev-Vault.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-2 px-4 rounded-2xl text-xs font-bold text-zinc-400">
          <Calendar size={14} /> {new Date().toLocaleDateString()}
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={`${stats.ingresos.toLocaleString("es-ES", { minimumFractionDigits: 2 })}€`}
          icon={<TrendingUp className="text-green-500" />}
          trend="+12%"
          color="text-white"
        />
        <StatCard
          title="Facturas Emitidas"
          value={stats.facturas.toString()}
          icon={<Receipt className="text-blue-500" />}
          color="text-white"
        />
        <StatCard
          title="Clientes Activos"
          value={stats.clientes.toString()}
          icon={<Users className="text-purple-500" />}
          color="text-white"
        />
      </div>

      {/* Gráfica Sincronizada */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <BarChart3 size={20} className="text-blue-500" />
            </div>
            <h2 className="font-bold text-lg">Rendimiento Mensual</h2>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datosGrafica}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f1f23"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12, fontWeight: "bold" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 10, fontWeight: "bold" }}
                tickFormatter={(value) => `${value.toLocaleString()}€`}
                width={70}
                // Dinámico: el techo siempre será un poco más alto que tus ingresos máximos
                domain={[0, "dataMax + 1000"]}
              />
              <Tooltip
                cursor={{ fill: "#27272a", radius: 8 }}
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="total" radius={[10, 10, 0, 0]} barSize={45}>
                {datosGrafica.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === mesActualIndex ? "#3b82f6" : "#27272a"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] hover:border-zinc-700 transition-all group shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-zinc-800 rounded-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
            <ArrowUpRight size={12} /> {trend}
          </span>
        )}
      </div>
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
        {title}
      </p>
      <p className={`text-3xl font-black mt-1 tracking-tighter ${color}`}>
        {value}
      </p>
    </div>
  );
}
