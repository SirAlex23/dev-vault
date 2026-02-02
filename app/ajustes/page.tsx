"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Save,
  CheckCircle,
} from "lucide-react";

export default function AjustesPage() {
  const [seccion, setSeccion] = useState<"menu" | "perfil" | "seguridad">(
    "menu",
  );
  const [perfil, setPerfil] = useState({
    id: "",
    nombre_empresa: "",
    nif_cif: "",
    direccion: "",
    email_contacto: "",
  });
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      const { data } = await supabase.from("perfil").select("*").single();
      if (data) setPerfil(data);
    };
    cargarPerfil();
  }, []);

  const guardarCambios = async () => {
    const { error } = await supabase
      .from("perfil")
      .update(perfil)
      .eq("id", perfil.id);
    if (!error) {
      setGuardado(true);
      setTimeout(() => {
        setGuardado(false);
        setSeccion("menu");
      }, 1500);
    }
  };

  if (seccion === "menu") {
    return (
      <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Configuración
          </h1>
          <p className="text-zinc-500 text-sm">
            Gestiona las preferencias de tu cuenta y negocio.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setSeccion("perfil")}
            className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-zinc-800 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold">Información Legal</h3>
                <p className="text-xs text-zinc-500">
                  NIF, Dirección y Nombre Comercial
                </p>
              </div>
            </div>
            <ChevronRight className="text-zinc-700 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={() => setSeccion("seguridad")}
            className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-zinc-800 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-500">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold">Seguridad y Acceso</h3>
                <p className="text-xs text-zinc-500">
                  PIN de bloqueo y sesiones
                </p>
              </div>
            </div>
            <ChevronRight className="text-zinc-700 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white">
      <button
        onClick={() => setSeccion("menu")}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Volver al menú
      </button>

      {seccion === "perfil" && (
        <div className="max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold">Datos de Empresa</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                Nombre Comercial
              </label>
              <input
                type="text"
                value={perfil.nombre_empresa}
                onChange={(e) =>
                  setPerfil({ ...perfil, nombre_empresa: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                NIF / CIF
              </label>
              <input
                type="text"
                value={perfil.nif_cif}
                onChange={(e) =>
                  setPerfil({ ...perfil, nif_cif: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                Dirección Fiscal
              </label>
              <input
                type="text"
                value={perfil.direccion}
                onChange={(e) =>
                  setPerfil({ ...perfil, direccion: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={guardarCambios}
              className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {guardado ? <CheckCircle size={20} /> : <Save size={20} />}
              {guardado ? "Guardado" : "Guardar Cambios"}
            </button>
          </div>
        </div>
      )}

      {seccion === "seguridad" && (
        <div className="max-w-xl p-8 bg-zinc-900 border border-zinc-800 rounded-3xl text-center">
          <ShieldCheck size={48} className="mx-auto text-purple-500 mb-4" />
          <h2 className="text-xl font-bold">PIN de Seguridad</h2>
          <p className="text-zinc-500 text-sm mt-2">
            Actualmente tu PIN es el que configuraste en el código.
          </p>
          <div className="mt-6 p-4 bg-black rounded-2xl border border-zinc-800 text-zinc-400 text-xs">
            Próximamente podrás cambiar el PIN directamente desde aquí.
          </div>
        </div>
      )}
    </div>
  );
}
