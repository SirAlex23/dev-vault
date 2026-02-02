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

  // No mostramos el menú lateral en la página de Login
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
          {/* SIDEBAR DESKTOP */}
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

            {/* BOTÓN CERRAR SESIÓN */}
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

          {/* CONTENIDO PRINCIPAL */}
          <main className="flex-1 md:ml-72 min-h-screen">
            {/* Header móvil */}
            <div className="md:hidden p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
              <h1 className="text-xl font-black italic">DEV-VAULT</h1>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
