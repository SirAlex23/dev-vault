"use client";
import { Inter } from "next/font/google";
import "./globals.css";
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
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/login";

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

  if (isLoginPage) {
    return (
      <html lang="es">
        <body className={`${inter.className} bg-black text-white`}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white`}>
        <div className="flex min-h-screen">
          {/* SIDEBAR DESKTOP (No se toca nada aquí) */}
          <aside className="hidden md:flex w-72 bg-zinc-900 border-r border-zinc-800 flex-col p-6 fixed h-full">
            <div className="mb-10 px-4">
              <h1 className="text-2xl font-black tracking-tighter italic text-white">
                DEV<span className="text-blue-500">-VAULT</span>
              </h1>
            </div>
            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-bold text-sm uppercase tracking-widest">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all mt-auto border border-transparent hover:border-red-500/20"
            >
              <LogOut size={20} />
              <span className="font-bold text-sm uppercase tracking-widest">
                Cerrar Sesión
              </span>
            </button>
          </aside>

          {/* CONTENIDO PRINCIPAL Y LÓGICA MÓVIL */}
          <main className="flex-1 md:ml-72 min-h-screen relative">
            {/* CABECERA MÓVIL (CORREGIDA) */}
            <div className="md:hidden sticky top-0 z-[100] p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center backdrop-blur-md bg-zinc-900/80">
              <h1 className="text-xl font-black italic tracking-tighter uppercase">
                Dev-Vault
              </h1>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 bg-zinc-800 rounded-xl text-white active:scale-95 transition-transform"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* MENÚ DESPLEGABLE MÓVIL (Lo que te faltaba) */}
            {isMobileMenuOpen && (
              <div className="md:hidden fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                <nav className="flex flex-col p-8 pt-24 space-y-4">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic
                        className={`flex items-center gap-5 p-5 rounded-[24px] text-xl font-black uppercase tracking-tighter transition-all ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-zinc-500 bg-zinc-900/50 border border-zinc-800"
                        }`}
                      >
                        <item.icon
                          size={24}
                          className={isActive ? "text-white" : "text-blue-500"}
                        />
                        {item.name}
                      </Link>
                    );
                  })}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-5 p-5 text-red-500 font-black uppercase tracking-tighter text-xl mt-8 border-t border-zinc-800 pt-10"
                  >
                    <LogOut size={24} />
                    Cerrar Sesión
                  </button>
                </nav>
              </div>
            )}

            {/* AQUÍ SE RENDERIZAN TUS PÁGINAS (No se toca) */}
            <div className="pb-20 md:pb-0">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
