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

      if (data && !error) {
        setPerfil(data);
      }
    };
    cargarPerfil();
  }, []);

  const guardarCambios = async () => {
    setCargando(true);

    // 1. Preparamos los datos. Si el ID es una cadena vacía, lo eliminamos
    // para evitar el error "invalid input syntax for type uuid"
    const datosAEnviar: any = {
      nombre_empresa: perfil.nombre_empresa,
      nif_cif: perfil.nif_cif,
      direccion: perfil.direccion,
      email_contacto: perfil.email_contacto,
      iban: perfil.iban,
      swift_bic: perfil.swift_bic,
      updated_at: new Date(),
    };

    // Solo enviamos el ID si realmente existe uno previo
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
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Perfil de Empresa
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Configura tus datos fiscales
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BLOQUE DATOS GENERALES */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
              <Building2 size={16} /> Información Básica
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-black ml-2">
                  Nombre Comercial
                </label>
                <input
                  type="text"
                  value={perfil.nombre_empresa}
                  onChange={(e) =>
                    setPerfil({ ...perfil, nombre_empresa: e.target.value })
                  }
                  className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: TecnoNova Solutions"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-black ml-2">
                  Email de Contacto
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-4 text-zinc-500"
                    size={18}
                  />
                  <input
                    type="email"
                    value={perfil.email_contacto}
                    onChange={(e) =>
                      setPerfil({ ...perfil, email_contacto: e.target.value })
                    }
                    className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-4 pl-12 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="admin@empresa.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-black ml-2">
                  Dirección Fiscal
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-4 text-zinc-500"
                    size={18}
                  />
                  <textarea
                    value={perfil.direccion}
                    onChange={(e) =>
                      setPerfil({ ...perfil, direccion: e.target.value })
                    }
                    className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-4 pl-12 text-white outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Calle, Número, Ciudad, CP"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BLOQUE DATOS BANCARIOS */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-green-500 flex items-center gap-2">
              <CreditCard size={16} /> Datos Bancarios
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-black ml-2">
                  IBAN de la Cuenta
                </label>
                <input
                  type="text"
                  value={perfil.iban}
                  onChange={(e) =>
                    setPerfil({ ...perfil, iban: e.target.value })
                  }
                  className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ES00 0000 0000 0000 0000 0000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-black ml-2">
                  SWIFT / BIC
                </label>
                <input
                  type="text"
                  value={perfil.swift_bic}
                  onChange={(e) =>
                    setPerfil({ ...perfil, swift_bic: e.target.value })
                  }
                  className="w-full bg-zinc-800 border-zinc-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="BXMADRSXXX"
                />
              </div>
            </div>

            <button
              onClick={guardarCambios}
              disabled={cargando}
              className={`w-full p-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                guardado
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
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
                ? "Guardando..."
                : guardado
                  ? "¡Guardado!"
                  : "Guardar Cambios"}
            </button>
          </div>
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
          <h3 className="text-xl font-black uppercase tracking-tighter">
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
