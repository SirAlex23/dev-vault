"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  ChevronRight,
  ArrowLeft,
  Save,
  CheckCircle,
  CreditCard,
  Mail,
  MapPin,
} from "lucide-react";

// Definimos la estructura para que TypeScript no de errores
interface Perfil {
  id: string;
  nombre_empresa: string;
  nif_cif: string;
  direccion: string;
  email_contacto: string;
  iban: string;
  swift_bic: string;
}

export default function AjustesPage() {
  const [seccion, setSeccion] = useState<"menu" | "perfil">("menu");
  const [perfil, setPerfil] = useState<Perfil>({
    id: "",
    nombre_empresa: "",
    nif_cif: "",
    direccion: "",
    email_contacto: "",
    iban: "",
    swift_bic: "",
  });
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      const { data, error } = await supabase
        .from("perfil")
        .select("*")
        .single();
      if (data) {
        setPerfil(data);
      } else if (error) {
        console.error("Error cargando perfil:", error.message);
      }
    };
    cargarPerfil();
  }, []);

  const guardarCambios = async () => {
    setCargando(true);
    const { error } = await supabase.from("perfil").upsert({
      ...perfil,
      updated_at: new Date(),
    });

    if (!error) {
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

  if (seccion === "menu") {
    return (
      <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white">
        <header>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">
            Configuración
          </h1>
          <p className="text-zinc-500 text-sm font-medium text-white">
            Gestiona los datos legales de tu negocio.
          </p>
        </header>

        <div className="max-w-2xl">
          <button
            onClick={() => setSeccion("perfil")}
            className="w-full flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] hover:border-zinc-600 transition-all text-left group shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-500 text-white">
                <Building2 size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  Información de Facturación
                </h3>
                <p className="text-xs text-zinc-500 text-white">
                  Datos fiscales, dirección e IBAN bancario
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
    <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white animate-in fade-in duration-500">
      <button
        onClick={() => setSeccion("menu")}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest text-white"
      >
        <ArrowLeft size={14} /> Volver a Ajustes
      </button>

      <div className="max-w-xl space-y-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            DATOS DE LA EMPRESA
          </h2>
          <p className="text-zinc-500 text-sm text-white">
            Estos datos aparecerán automáticamente en tus facturas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nombre Comercial"
              value={perfil.nombre_empresa}
              onChange={(v: string) =>
                setPerfil({ ...perfil, nombre_empresa: v })
              }
              icon={<Building2 size={14} />}
            />
            <InputField
              label="NIF / CIF"
              value={perfil.nif_cif}
              onChange={(v: string) => setPerfil({ ...perfil, nif_cif: v })}
            />
          </div>

          <InputField
            label="Email de Contacto"
            value={perfil.email_contacto}
            onChange={(v: string) =>
              setPerfil({ ...perfil, email_contacto: v })
            }
            icon={<Mail size={14} />}
          />
          <InputField
            label="Dirección Fiscal"
            value={perfil.direccion}
            onChange={(v: string) => setPerfil({ ...perfil, direccion: v })}
            icon={<MapPin size={14} />}
          />

          <div className="pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 text-white text-white">
              Datos Bancarios
            </h3>
            <div className="space-y-4">
              <InputField
                label="IBAN de la Cuenta"
                value={perfil.iban}
                onChange={(v: string) => setPerfil({ ...perfil, iban: v })}
                icon={<CreditCard size={14} />}
                placeholder="ES00 0000 0000..."
              />
              <InputField
                label="SWIFT / BIC"
                value={perfil.swift_bic}
                onChange={(v: string) => setPerfil({ ...perfil, swift_bic: v })} // Corregido 'percent' por 'perfil'
                placeholder="NOMBESSXXX"
              />
            </div>
          </div>

          <button
            onClick={guardarCambios}
            disabled={cargando}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${
              guardado
                ? "bg-green-500 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {guardado ? <CheckCircle size={18} /> : <Save size={18} />}
            {guardado
              ? "¡Cambios guardados con éxito!"
              : cargando
                ? "Guardando..."
                : "Guardar Configuración"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente de Input con tipos definidos para evitar errores de TS
function InputField({
  label,
  value,
  onChange,
  icon,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.15em] ml-1 flex items-center gap-2 text-white">
        {icon} {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-700 text-white"
      />
    </div>
  );
}
