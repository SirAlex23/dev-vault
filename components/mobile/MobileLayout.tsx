"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Receipt,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function MobileLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Panel", href: "/panel", icon: LayoutDashboard },
    { name: "Clientes", href: "/clientes", icon: Users },
    { name: "Facturas", href: "/facturas", icon: Receipt },
    { name: "Ingresos", href: "/ingresos", icon: CreditCard },
    { name: "Ajustes", href: "/ajustes", icon: Settings },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="md:hidden">
      {/* BARRA SUPERIOR FIJA */}
      <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-b border-zinc-900 p-4 flex justify-between items-center z-[100]">
        <h1 className="text-xl font-black uppercase tracking-tighter italic">
          Dev<span className="text-blue-500">-Vault</span>
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white active:scale-90 transition-transform"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* MENÚ DESPLEGABLE FULLSCREEN */}
      {isOpen && (
        <div className="fixed inset-0 bg-black z-[90] flex flex-col p-6 pt-24 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="space-y-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 p-5 rounded-[24px] font-black uppercase tracking-tighter text-lg transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-zinc-900/50 border border-zinc-800 text-zinc-400"
                  }`}
                >
                  <item.icon
                    size={22}
                    className={isActive ? "text-white" : "text-blue-500"}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleSignOut}
            className="mt-auto mb-10 flex items-center gap-4 p-6 text-red-500 font-black uppercase tracking-widest text-sm border-t border-zinc-900 pt-8"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
