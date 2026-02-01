"use client";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Receipt,
  DollarSign,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Panel", href: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Clientes", href: "/clientes", icon: <Users size={20} /> },
    { name: "Facturas", href: "/facturas", icon: <Receipt size={20} /> },
    { name: "Ingresos", href: "/ingresos", icon: <DollarSign size={20} /> },
    { name: "Ajustes", href: "/ajustes", icon: <Settings size={20} /> },
  ];

  return (
    <html lang="es">
      <body className="bg-black text-white flex flex-col md:flex-row min-h-screen">
        {/* HEADER MÓVIL (Solo visible en pantallas pequeñas) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-black sticky top-0 z-50">
          <h1 className="text-xl font-black tracking-tighter text-blue-500">
            DEV-VAULT
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-400"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* SIDEBAR (Responsive) */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-900 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="p-8">
            <h1 className="text-2xl font-black tracking-tighter text-white mb-10 hidden md:block">
              DEV<span className="text-blue-500">-VAULT</span>
            </h1>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all font-medium group"
                >
                  <span className="group-hover:text-blue-500 transition-colors">
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* OVERLAY PARA MÓVIL (Cierra el menú al tocar fuera) */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
