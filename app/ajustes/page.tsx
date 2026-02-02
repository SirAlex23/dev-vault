"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Building2, Save, CheckCircle } from "lucide-react";

export default function AjustesPage() {
  const [perfil, setPerfil] = useState({
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
      .eq("id", (perfil as any).id);

    if (!error) {
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Configuración</h1>
        <p className="text-zinc-500 text-sm">
          Gestiona los datos legales de tu negocio.
        </p>
      </header>

      <div className="max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
          <Building2 className="text-blue-500" size={24} />
          <h2 className="font-bold text-lg">Datos de Empresa</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej: Dev-Vault S.L."
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
                className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej: B12345678"
              />
            </div>
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
              className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Calle Falsa 123, Madrid"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
              Email de Contacto
            </label>
            <input
              type="email"
              value={perfil.email_contacto}
              onChange={(e) =>
                setPerfil({ ...perfil, email_contacto: e.target.value })
              }
              className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="contacto@tuempresa.com"
            />
          </div>

          <button
            onClick={guardarCambios}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            {guardado ? <CheckCircle size={20} /> : <Save size={20} />}
            {guardado ? "¡Cambios Guardados!" : "Guardar Configuración"}
          </button>
        </div>
      </div>
    </div>
  );
}
