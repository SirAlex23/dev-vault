"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  Mail,
  MapPin,
  CreditCard,
  Save,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Fingerprint, // Icono para el NIF
} from "lucide-react";

export default function AjustesPage() {
  const [seccion, setSeccion] = useState("menu");
  const [cargando, setCargando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [perfil, setPerfil] = useState({
    id: "",
    nombre_empresa: "",
    nif_cif: "",
    direccion: "",
    email_contacto: "",
    iban: "",
    swift_bic: "",
  });

  useEffect(() => {
    const cargarPerfil = async () => {
      const { data, error } = await supabase
        .from("perfil")
        .select("*")
        .single();
      if (data && !error) setPerfil(data);
    };
    cargarPerfil();
  }, []);

  const guardarCambios = async () => {
    setCargando(true);
    const datosAEnviar: any = {
      nombre_empresa: perfil.nombre_empresa,
      nif_cif: perfil.nif_cif,
      direccion: perfil.direccion,
      email_contacto: perfil.email_contacto,
      iban: perfil.iban,
      swift_bic: perfil.swift_bic,
      updated_at: new Date(),
    };

    if (perfil.id && perfil.id.trim() !== "") {
      datosAEnviar.id = perfil.id;
    }

    const { data, error } = await supabase
      .from("perfil")
      .upsert(datosAEnviar)
      .select()
      .single();

    if (!error) {
      if (data) setPerfil(data);
      setGuardado(true);
      setTimeout(() => {
        setGuardado(false);
        setSeccion("menu");
      }, 2000);
    } else {
      alert("Error al guardar: " + error.message);
    }
    setCargando(false);
  };

  if (seccion === "empresa") {
    return (
      <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white animate-in fade-in duration-500">
        <header className="flex items-center gap-4">
          <button
            onClick={() => setSeccion("menu")}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">
              Perfil de Empresa
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Configura tus datos fiscales
            </p>
          </div>
        </header>

        <div className="max-w-4xl space-y-6">
          {/* SECCIÓN DATOS FISCALES */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] ml-2">
                Nombre Comercial
              </label>
              <input
                type="text"
                value={perfil.nombre_empresa}
                onChange={(e) =>
                  setPerfil({ ...perfil, nombre_empresa: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] ml-2">
                NIF / CIF
              </label>
              <input
                type="text"
                value={perfil.nif_cif}
                onChange={(e) =>
                  setPerfil({ ...perfil, nif_cif: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="B12345678"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] ml-2">
                Email de Contacto
              </label>
              <input
                type="email"
                value={perfil.email_contacto}
                onChange={(e) =>
                  setPerfil({ ...perfil, email_contacto: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] ml-2">
                Dirección Fiscal
              </label>
              <textarea
                value={perfil.direccion}
                onChange={(e) =>
                  setPerfil({ ...perfil, direccion: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              />
            </div>
          </div>

          <hr className="border-zinc-800 my-8" />

          {/* SECCIÓN DATOS BANCARIOS */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">
              Datos Bancarios
            </h2>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] ml-2">
                Iban de la cuenta
              </label>
              <input
                type="text"
                value={perfil.iban}
                onChange={(e) => setPerfil({ ...perfil, iban: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] ml-2">
                Swift / BIC
              </label>
              <input
                type="text"
                value={perfil.swift_bic}
                onChange={(e) =>
                  setPerfil({ ...perfil, swift_bic: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            onClick={guardarCambios}
            disabled={cargando}
            className={`w-full p-4 mt-8 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
              guardado
                ? "bg-green-600 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {cargando ? (
              <Loader2 className="animate-spin" />
            ) : guardado ? (
              <CheckCircle2 />
            ) : (
              <Save size={20} />
            )}
            {cargando
              ? "GUARDANDO..."
              : guardado
                ? "¡GUARDADO!"
                : "GUARDAR CAMBIOS"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">
          Ajustes
        </h1>
        <p className="text-zinc-500 font-medium mt-1">
          Configuración del sistema y cuenta.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setSeccion("empresa")}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px] text-left hover:border-blue-500/50 transition-all group"
        >
          <div className="bg-blue-500/10 text-blue-500 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
            <Building2 size={32} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter italic">
            Empresa
          </h3>
          <p className="text-zinc-500 text-sm font-medium mt-1">
            Datos fiscales, IBAN y contacto.
          </p>
        </button>
      </div>
    </div>
  );
}
