"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  TrendingUp,
  Users,
  Receipt,
  Wallet,
  ArrowUpRight,
  Clock,
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

// Definimos qué datos lleva cada tarjeta para evitar errores de TS
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string; // El ? significa que es opcional
  color?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    ingresosTotales: 0,
    clientesActivos: 0,
    facturasPendientes: 0,
    saldoBase: 5000,
  });
  const [graficaData, setGraficaData] = useState<any[]>([]);

  const cargarDashboard = async () => {
    // 1. Obtener Facturas
    const { data: facturas } = await supabase.from("facturas").select("*");

    // 2. Obtener Clientes Activos
    const { count: totalClientes } = await supabase
      .from("clientes")
      .select("*", { count: "exact", head: true })
      .eq("activo", true);

    if (facturas) {
      // Calcular Ingresos (Facturas Pagadas) - Usando nombres exactos de tu captura
      const pagadas = facturas
        .filter((f) => f.estado === "Pagada")
        .reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);

      const pendientes = facturas.filter(
        (f) => f.estado === "Pendiente",
      ).length;

      const meses = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      const datosAgrupados = meses.map((mes) => ({ name: mes, total: 0 }));

      facturas.forEach((f) => {
        if (f.estado === "Pagada") {
          const fecha = new Date(f.created_at);
          const mesIndex = fecha.getMonth();
          datosAgrupados[mesIndex].total += Number(f.monto);
        }
      });

      setStats({
        ingresosTotales: pagadas + stats.saldoBase,
        clientesActivos: totalClientes || 0,
        facturasPendientes: pendientes,
        saldoBase: stats.saldoBase,
      });
      setGraficaData(datosAgrupados);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen text-white">
      <header>
        <h1 className="text-4xl font-black tracking-tight">Panel de Control</h1>
        <p className="text-zinc-500 mt-2 font-medium">
          Visualiza el rendimiento real de Dev-Vault.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={`${stats.ingresosTotales}€`}
          icon={<Wallet className="text-blue-500" />}
          trend="+12.5%"
        />
        <StatCard
          title="Clientes Activos"
          value={stats.clientesActivos.toString()}
          icon={<Users className="text-purple-500" />}
        />
        <StatCard
          title="Facturas Pendientes"
          value={stats.facturasPendientes.toString()}
          icon={<Clock className="text-orange-500" />}
          color="text-orange-500"
        />
        <StatCard
          title="Rendimiento Mensual"
          value="Alta"
          icon={<TrendingUp className="text-green-500" />}
        />
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
          <Receipt size={20} className="text-blue-500" /> Flujo de Ingresos por
          Mes
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graficaData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#71717a", fontSize: 10 }}
                interval={0}
              />
              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}€`}
              />
              <Tooltip
                cursor={{ fill: "#27272a" }}
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {graficaData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.total > 0 ? "#3b82f6" : "#27272a"}
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

// CORRECCIÓN DE TIPOS PARA VS CODE
function StatCard({
  title,
  value,
  icon,
  trend,
  color = "text-white",
}: StatCardProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl hover:border-zinc-700 transition-all group">
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
