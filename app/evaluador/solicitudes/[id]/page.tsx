"use client";

import { useEffect, useState, use } from "react";
import {
  User, MapPin, Phone, Mail, Calendar,
  Activity, RefreshCw, ArrowLeft, FileText, CheckCircle,
  AlertTriangle, XCircle, CreditCard, Hash, ShieldAlert, Check,
  Bot,
  Lightbulb,
  Sparkles
} from "lucide-react";


function PremiumGauge({ value }: { value: number }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPercent(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  // Configuración del arco
  const radius = 85;
  const circumference = Math.PI * radius; // Semi-círculo
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Color dinámico según riesgo
  const getColor = (v: number) => {
    if (v < 30) return "#10B981"; // Emerald (Bajo riesgo)
    if (v < 70) return "#F59E0B"; // Amber (Medio)
    return "#EF4444"; // Red (Alto riesgo)
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[280px] mx-auto aspect-[2/1.3]">
      <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
        {/* Definición de Gradiente */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />  {/* Verde */}
            <stop offset="50%" stopColor="#F59E0B" /> {/* Amarillo */}
            <stop offset="100%" stopColor="#EF4444" /> {/* Rojo */}
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Arco de Fondo (Gris) */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Arco de Valor (Animado) */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-[1500ms] ease-out"
          filter="url(#glow)"
        />

        {/* Aguja (Needle) */}
        <g className="transition-transform duration-[1500ms] ease-out origin-[100px_100px]"
          style={{ transform: `rotate(${(percent * 1.8) - 90}deg)` }}>
          <circle cx="100" cy="100" r="6" fill="#1E293B" />
          <path d="M 100 100 L 100 25" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Texto de etiquetas (0 y 100) */}
        <text x="15" y="115" className="text-[10px] fill-slate-400 font-bold">0%</text>
        <text x="175" y="115" className="text-[10px] fill-slate-400 font-bold">100%</text>
      </svg>

      {/* Valor Central Grande */}
      <div className="absolute bottom-0 flex flex-col items-center translate-y-2">
        <span className="text-4xl font-extrabold text-slate-800 tracking-tighter" style={{ color: getColor(percent) }}>
          {percent.toFixed(1)}%
        </span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Probabilidad de Default</span>
      </div>
    </div>
  );
}


export default function DetalleSolicitud({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params) as { id: string };

  const [solicitud, setSolicitud] = useState<any>(null);
  const [precliente, setPrecliente] = useState<any>(null);
  const [scoring, setScoring] = useState<any>(null);
  const [interpretacion, setInterpretacion] = useState("");
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  // Acciones del modal
  const [accion, setAccion] = useState<"aprobar" | "rechazar" | null>(null);
  const [ejecutandoAccion, setEjecutandoAccion] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // Simulación rápida para ver la UI (Reemplaza con tus fetch reales)
        const solRes = await fetch(`/api/scorin_risk/solicitudes/${id}`);
        if (!solRes.ok) throw new Error("Error");
        const solJson = await solRes.json();
        setSolicitud(solJson);

        const preRes = await fetch(`/api/scorin_risk/pre_clientes/${solJson.preClienteId}`);
        if (preRes.ok) setPrecliente(await preRes.json());

        const scoreRes = await fetch(`/api/scorin_risk/solicitudes/${id}/scoring`);
        if (scoreRes.ok) {
          const s = await scoreRes.json();
          setScoring(s);
          const iRes = await fetch(`/api/scorin_risk/score/${s.id}/interpretacion`);
          if (iRes.ok) {
            const i = await iRes.json();
            setInterpretacion(i?.resumen || "");
          }
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleAccionConfirmada() {
    setEjecutandoAccion(true);
    await new Promise(res => res(1000));
    alert(`Acción ${accion} completada.`);
    setEjecutandoAccion(false);
    setAccion(null);
  }

  const formatMoney = (amount: number) =>
    amount?.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-400 gap-2"><Activity className="animate-spin" /> Cargando...</div>;
  if (!solicitud) return <div>No encontrado</div>;

  const riesgo = scoring?.riesgo ? scoring.riesgo * 100 : 0;
  const variables = scoring?.variablesJson ? JSON.parse(scoring.variablesJson) : {};

  const processInterpretation = (text: string) => {
    if (!text) return [];
    // Dividimos por '|' si existe, si no, intentamos por puntos seguidos '.'
    // Esto asume que tu backend manda 'Idea 1 | Idea 2 | Idea 3'
    const delimiter = text.includes("|") ? "|" : ". ";

    return text
      .split(delimiter)
      .map((t) => t.trim())
      .filter((t) => t.length > 5); // Filtramos frases vacías o muy cortas
  };

  const insights = processInterpretation(interpretacion);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-24 md:pb-10">

      {/* TOP BAR */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="/evaluador/solicitudes" className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Expediente #{solicitud.id}</h1>
            <p className="text-xs text-slate-500">Evaluación de Riesgo Crediticio</p>
          </div>
        </div>
        <div className="hidden md:block">
          <BadgeEstadoGrande estado={solicitud.estadoPredicente} />
        </div>
      </div>

      <div className="p-6 md:p-10 max-w-8xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* === COLUMNA IZQUIERDA (Datos) === */}
          <div className="xl:col-span-2 space-y-8">
            {/* DATOS PRECLIENTE */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <User className="w-5 h-5 text-blue-600" /> Datos Personales
                </div>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold">DNI VERIFICADO</span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <DataPoint label="Nombre Completo" value={`${precliente?.nombre} ${precliente?.apellido}`} large />
                <DataPoint label="DNI" value={precliente?.numeroDni} icon={<Hash className="w-4 h-4" />} />
                <DataPoint label="Contacto" value={precliente?.numeroCelular} icon={<Phone className="w-4 h-4" />} />
                <DataPoint label="Ubicación" value={`${precliente?.distrito}, ${precliente?.departamento}`} icon={<MapPin className="w-4 h-4" />} />
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all duration-300">
              {/* HEADER */}
              <div className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Bot className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                      Interpretación
                    </h2>
                    <p className="text-xs text-slate-400">Análisis automático de factores</p>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-orange-300" />
              </div>

              {/* CONTENIDO ESTRUCTURADO */}
              <div className="p-6 bg-slate-50/50 text-[15]">
                {insights.length > 0 ? (
                  <div className="space-y-4">
                    {insights.map((point, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-orange-200 transition-colors"
                      >
                        {/* Icono dinámico o numérico */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-6 h-6 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>

                        {/* Texto del punto */}
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {/* Resaltamos números automáticamente si los hay */}
                          {point.split(/(\d+(?:[.,]\d+)?%?)/).map((part, i) =>
                            /\d/.test(part) ? <strong key={i} className="text-slate-800">{part}</strong> : part
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fallback si no hay texto
                  <div className="text-center py-8 text-slate-400 italic">
                    No hay interpretación disponible para este caso.
                  </div>
                )}

                {/* CONCLUSIÓN / FOOTER (Opcional visualmente) */}
                <div className="mt-6 flex gap-3 items-start p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Nota del modelo:</strong> Este análisis se basa en datos históricos y patrones de comportamiento. Se recomienda validar ingresos manualmente si el riesgo es limítrofe.
                  </p>
                </div>
              </div>
            </section>

            {/* DATOS CRÉDITO */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-800">
                <CreditCard className="w-5 h-5 text-emerald-600" /> Condiciones Financieras
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-8">
                <DataPoint label="Monto Solicitado" value={formatMoney(solicitud.montoTotal)} large highlight />
                <DataPoint label="Cuota Inicial" value={formatMoney(solicitud.montoInicial)} />
                <DataPoint label="Plazo" value={`${solicitud.numeroCuotas} meses`} />
                <DataPoint label="Tasa Interés" value={`${solicitud.interes}%`} />
                <DataPoint label="Cuota Mensual" value={formatMoney(solicitud.montoCuota)} highlight />
              </div>
            </section>


          </div>

          {/* === COLUMNA DERECHA (Panel de Control) === */}
          <div className="xl:col-span-1 space-y-6 sticky top-24">

            {/* 1. SCORING CARD (Rediseñada) */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-900/5 border border-indigo-50 overflow-hidden relative">
              <div className="bg-[#1E293B] px-6 py-4 flex justify-between items-center">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" /> Score ML
                </h2>
                <span className="text-[10px] font-mono bg-slate-700 text-slate-300 px-2 py-1 rounded">v2.1</span>
              </div>

              <div className="p-6 pt-8 pb-8 flex flex-col items-center bg-gradient-to-b from-white to-slate-50">
                {/* AQUÍ ESTÁ EL NUEVO GAUGE */}
                <PremiumGauge value={riesgo} />

                {/* Variables Resumen */}
                <div className="w-full mt-8 pt-6 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Factores de Riesgo
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(variables).slice(0, 3).map(([k, v]: any) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-slate-600 capitalize">{k.replace(/_/g, ' ')}</span>
                        <span className="font-bold text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PANEL DE ACCIONES (Más visible y separado) */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hidden md:block">
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Decisión Final</h3>
              </div>
              <div className="p-6 space-y-4">
                {/*<button
                  onClick={() => setAccion("aprobar")}
                  className="w-full group flex items-center justify-between p-4 bg-white border-2 border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-800 group-hover:text-emerald-700">Aprobar Crédito</div>
                      <div className="text-xs text-slate-500">Cumple políticas</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setAccion("rechazar")}
                  className="w-full group flex items-center justify-between p-4 bg-white border-2 border-rose-100 hover:border-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-rose-100 text-rose-600 p-2 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <XCircle className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-800 group-hover:text-rose-700">Rechazar</div>
                      <div className="text-xs text-slate-500">Alto riesgo detectado</div>
                    </div>
                  </div>
                </button>*/}

                <div className="pt-4 border-t border-slate-100">
                  <button className="w-full text-sm text-slate-500 font-medium hover:text-blue-600 flex items-center justify-center gap-2 py-2">
                    <RefreshCw className="w-4 h-4" /> Recalcular Variables
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* === BARRA FLOTANTE MÓVIL (Solo visible en small screens) === */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40 flex gap-3">
        <button
          onClick={() => setAccion("rechazar")}
          className="flex-1 bg-rose-100 text-rose-700 font-bold py-3 rounded-xl border border-rose-200"
        >
          Rechazar
        </button>
        <button
          onClick={() => setAccion("aprobar")}
          className="flex-[2] bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200"
        >
          Aprobar Solicitud
        </button>
      </div>

      {/* MODAL CONFIRMACIÓN */}
      {accion && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-100">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${accion === 'aprobar' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
              {accion === 'aprobar' ? <Check className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2 capitalize">
              {accion} Solicitud
            </h3>
            <p className="text-center text-slate-500 text-sm mb-6">
              Esta acción es irreversible y se notificará al sistema central. ¿Desea continuar?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAccionConfirmada}
                disabled={ejecutandoAccion}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg ${accion === 'aprobar' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
              >
                {ejecutandoAccion ? "Procesando..." : "Confirmar Decisión"}
              </button>
              <button onClick={() => setAccion(null)} className="py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// UI Helpers
function DataPoint({ label, value, icon, large, highlight }: any) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 mb-0.5">
        {icon && <span className="text-slate-400">{icon}</span>}
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`${large ? 'text-lg' : 'text-sm'} font-medium text-slate-800 truncate ${highlight ? 'font-bold text-slate-900' : ''}`}>
        {value || "—"}
      </div>
    </div>
  )
}

function BadgeEstadoGrande({ estado }: { estado: string }) {
  const styles = {
    pendiente: "bg-amber-100 text-amber-700 border-amber-200",
    aprobado: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rechazado: "bg-rose-100 text-rose-700 border-rose-200"
  }[estado as string] || "bg-slate-100 text-slate-600";

  return <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${styles}`}>{estado || "Desconocido"}</span>;
}