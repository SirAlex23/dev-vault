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

  useEffect(() => {
    const cargarDatos = async () => {
      // Cargamos facturas (Supabase filtra por usuario solo gracias al SQL que hicimos)
      const { data: facturas } = await supabase.from("facturas").select("*");
      const { data: clientes } = await supabase.from("clientes").select("*");

      if (facturas) {
        const total = facturas.reduce(
          (acc, f) => acc + (f.estado === "Pagada" ? f.monto : 0),
          0,
        );
        setStats({
          ingresos: total,
          facturas: facturas.length,
          clientes: clientes?.length || 0,
        });

        // Agrupar por mes para la gráfica
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
        const dummyData = meses.map((mes) => ({
          name: mes,
          total: Math.floor(Math.random() * 2000) + 500, // Luego lo cambiaremos por datos reales
        }));
        setDatosGrafica(dummyData);
      }
    };
    cargarDatos();
  }, []);

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

      {/* Grid de Stats - AQUÍ ESTÁ TU CÓDIGO DE ESTILOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={`${stats.ingresos.toFixed(2)}€`}
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

      {/* Gráfica */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <BarChart3 size={20} className="text-blue-500" />
            </div>
            <h2 className="font-bold text-lg">Rendimiento Mensual</h2>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosGrafica}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "#27272a" }}
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
                {datosGrafica.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === datosGrafica.length - 1 ? "#3b82f6" : "#27272a"
                    }
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

// TU COMPONENTE DE ESTILOS QUE ME PASASTE
function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] hover:border-zinc-700 transition-all group">
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
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
        {title}
      </p>
      <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
    </div>
  );
}
