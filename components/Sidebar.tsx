import {
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  Settings,
} from "lucide-react";
import Link from "next/link";

const menuItems = [
  { icon: LayoutDashboard, label: "Panel", href: "/" },
  { icon: Users, label: "Clientes", href: "/clientes" },
  { icon: FileText, label: "Facturas", href: "/facturas" },
  { icon: Wallet, label: "Ingresos", href: "/ingresos" },
  { icon: Settings, label: "Ajustes", href: "/ajustes" },
];

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950 p-6 text-zinc-400">
      <div className="mb-10">
        <h2 className="text-2xl font-bold tracking-tighter text-white">
          Dev-<span className="text-blue-500">Vault</span>
        </h2>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
