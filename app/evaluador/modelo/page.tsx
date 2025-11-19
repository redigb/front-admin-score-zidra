"use client";
import { useEffect, useState } from "react";
import { Activity, CheckCircle, Calendar, BarChart3, AlertCircle, Database, TrendingUp } from "lucide-react";

// --- Tipos ---
interface ModelMetrics {
    version: number;
    mode: string;
    auc: number;
    ks: number;
    f1: number;
    precision: number;
    recall: number;
    created_at: string;
    rows_train?: number;
}

export default function ModeloDashboard() {
    const [activeModel, setActiveModel] = useState<ModelMetrics | null>(null);
    const [history, setHistory] = useState<ModelMetrics[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resActive, resHistory] = await Promise.all([
                    fetch("/api/scorin_risk/modelo/activo"),
                    fetch("/api/scorin_risk/modelo/historial_modelos")
                ]);

                const activeData = await resActive.json();
                const historyData = await resHistory.json();

                setActiveModel(activeData);
                const items = historyData.items || [];
                setHistory(items.sort((a: any, b: any) => a.version - b.version));

                setTimeout(() => setIsMounted(true), 100);

            } catch (error) {
                console.error("Error cargando datos", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fmtDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("es-PE", {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F7FC] text-slate-400 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-base font-medium animate-pulse">Cargando métricas...</span>
        </div>
    );

    if (!activeModel) return <div className="p-10 text-red-500 font-bold">Error al cargar el dashboard.</div>;

    return (
        <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">

            {/* --- HEADER --- */}
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div>
                    {/* Tamaño de título equilibrado (text-3xl) */}
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Modelo de Riesgo
                    </h1>
                    <p className="text-slate-500 mt-1 text-base">
                        Monitor de rendimiento en tiempo real.
                    </p>
                </div>

                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 pr-3 border-r border-slate-100">
                        <div className={`w-2.5 h-2.5 rounded-full ${activeModel.mode === 'full' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'} animate-pulse`}></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Activo</span>
                    </div>
                    <span className="font-mono text-base font-bold text-slate-800">
                        v{activeModel.version}.0
                    </span>
                </div>
            </div>

            {/* --- KPI CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="AUC Score"
                    value={activeModel.auc}
                    isPercent={true}
                    icon={<Activity className="w-5 h-5" />}
                    delay={100}
                    mounted={isMounted}
                    description="Poder predictivo"
                />
                <MetricCard
                    title="KS Score"
                    value={activeModel.ks}
                    isPercent={true}
                    icon={<BarChart3 className="w-5 h-5" />}
                    delay={200}
                    mounted={isMounted}
                    description="Separación"
                />
                <MetricCard
                    title="F1 Balance"
                    value={activeModel.f1}
                    isPercent={true}
                    icon={<CheckCircle className="w-5 h-5" />}
                    delay={300}
                    mounted={isMounted}
                    description="Precisión vs Recall"
                />

                {/* Card Fecha */}
                <div
                    className={`bg-white p-6 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between transition-all duration-700 transform h-full min-h-[140px] ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: '400ms' }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2.5 bg-slate-50 rounded-lg text-slate-500"><Calendar className="w-5 h-5" /></div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Último Entreno</p>
                        {/* Tamaño intermedio (text-2xl) */}
                        <h4 className="text-2xl font-bold text-slate-800">
                            {fmtDate(activeModel.created_at)}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                            {new Date(activeModel.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- GRID INFERIOR --- */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* --- COLUMNA IZQ: DETALLE --- */}
                <div className={`xl:col-span-1 space-y-6 transition-all duration-700 delay-500 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

                    {/* Métricas de Clasificación */}
                    <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Efectividad</h3>
                        </div>

                        <div className="space-y-6">
                            <ProgressBar label="Precisión" value={activeModel.precision} color="bg-slate-800" />
                            <ProgressBar label="Recall (Sensibilidad)" value={activeModel.recall} color="bg-blue-600" />
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-full text-slate-400"><Database className="w-4 h-4" /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Volumen de Entrenamiento</p>
                                <p className="text-base font-bold text-slate-800">
                                    {history.find(h => h.version === activeModel.version)?.rows_train?.toLocaleString() || "N/A"} <span className="text-sm font-normal text-slate-400">filas</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Alerta de Estado */}
                    <div className={`p-5 rounded-xl border-l-4 shadow-sm bg-white ${activeModel.ks < 0.4 ? 'border-amber-400' : 'border-emerald-500'}`}>
                        <div className="flex items-start gap-4">
                            <div className={`mt-0.5 p-1 rounded-full ${activeModel.ks < 0.4 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {activeModel.ks < 0.4 ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-base mb-1">
                                    {activeModel.ks < 0.4 ? "Atención Requerida" : "Modelo Saludable"}
                                </h4>
                                <p className="text-sm leading-relaxed text-slate-600">
                                    El KS actual es <strong>{(activeModel.ks * 100).toFixed(2)}%</strong>.
                                    {activeModel.ks < 0.4
                                        ? " Capacidad baja."
                                        : " Separa correctamente buenos/malos."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COLUMNA DER: GRÁFICA --- */}
                <div className={`xl:col-span-2 bg-white p-6 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col min-h-[450px] transition-all duration-700 delay-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex justify-between items-center mb-4"> {/* Reduje el margin-bottom aquí */}
                        <h3 className="text-lg font-bold text-slate-800">Historial de Rendimiento (AUC)</h3>
                        <div className="flex gap-4 text-xs font-medium">
                            <div className="flex items-center gap-2 text-slate-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Versión Activa
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span> Histórico
                            </div>
                        </div>
                    </div>

                    {/* AQUÍ ESTÁ EL CAMBIO CLAVE:
       1. 'pt-12' o 'pt-16': Crea espacio arriba DENTRO del scroll para el tooltip.
       2. 'overflow-visible': Intenta forzar visibilidad (aunque overflow-x manda).
       3. Ajustamos el 'h-full' para compensar el padding.
    */}
                    <div className="flex-1 w-full overflow-x-auto overflow-y-hidden pb-2 pt-14 px-2">
                        <div className="flex items-end justify-between gap-6 min-w-[500px] h-full border-b border-slate-200 relative">

                            {/* Línea base 50% */}
                            <div className="absolute w-full border-t border-dashed border-slate-300 bottom-[50%] left-0 z-0"></div>
                            <span className="absolute right-0 -top-5 bottom-[50%] text-[10px] font-bold text-slate-400 bg-white pl-1">Base 0.5</span>

                            {history.length === 0 ? (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No hay historial disponible</div>
                            ) : (
                                history.map((model, i) => {
                                    const isCurrent = model.version === activeModel.version;
                                    const heightPercent = Math.max(model.auc * 100, 5);

                                    return (
                                        // Asegúrate de que este div tenga 'group' y 'relative'
                                        <div key={i} className="flex flex-col items-center gap-2 w-full h-full justify-end group relative z-10">

                                            {/* TU TOOLTIP (Pegar tal cual lo tienes, el bg-slate-800 está perfecto) */}
                                            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl z-50 pointer-events-none">
                                                <div className="font-bold mb-1 border-b border-slate-600 pb-1">Versión {model.version}</div>
                                                <div className="flex justify-between gap-3 text-slate-300">
                                                    <span>AUC:</span> <span className="text-white font-mono">{(model.auc * 100).toFixed(2)}%</span>
                                                </div>
                                                <div className="flex justify-between gap-3 text-slate-300">
                                                    <span>KS:</span> <span className="text-white font-mono">{(model.ks * 100).toFixed(2)}%</span>
                                                </div>
                                                <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-slate-800 transform -translate-x-1/2 rotate-45"></div>
                                            </div>

                                            {/* Barra y Texto de abajo siguen igual... */}
                                            <div
                                                className={`w-full max-w-[56px] rounded-t-md transition-all duration-700 ease-out relative cursor-pointer ${isCurrent
                                                        ? 'bg-gradient-to-b from-blue-600 to-blue-700 shadow-lg shadow-blue-200'
                                                        : 'bg-slate-200 hover:bg-slate-300'
                                                    }`}
                                                style={{
                                                    height: isMounted ? `${heightPercent}%` : '0%',
                                                    transitionDelay: `${i * 100}ms`
                                                }}
                                            >
                                                <span className={`absolute w-full text-center text-xs font-bold transition-opacity duration-300 ${isCurrent ? 'top-2 text-white/90 opacity-100' : '-top-6 text-slate-600 opacity-0 group-hover:opacity-100'
                                                    }`}>
                                                    {(model.auc * 100).toFixed(0)}%
                                                </span>
                                            </div>

                                            <div className="text-center h-8">
                                                <span className={`text-xs font-bold block transition-colors ${isCurrent ? 'text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                                    v{model.version}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

// --- COMPONENTES UI ---
function MetricCard({ title, value, isPercent = false, icon, description, delay, mounted }: any) {
    return (
        <div
            className={`bg-white p-6 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between transition-all duration-700 transform h-full min-h-[140px] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 bg-slate-50 rounded-lg text-slate-500 transition-colors">
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
                {/* Texto intermedio (text-3xl) */}
                <h4 className="text-3xl font-bold text-slate-800 tracking-tight">
                    <CountUp end={value * (isPercent ? 100 : 1)} duration={1500} />
                    {isPercent && <span className="text-lg text-slate-400 ml-1">%</span>}
                </h4>
                {description && <p className="text-sm text-slate-400 mt-1 font-medium">{description}</p>}
            </div>
        </div>
    );
}

function CountUp({ end, duration = 2000 }: { end: number, duration?: number }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime: number;
        let animationFrame: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
            setCount(end * ease);
            if (progress < duration) animationFrame = requestAnimationFrame(animate);
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);
    return <>{count.toFixed(2)}</>;
}

function ProgressBar({ label, value, color }: { label: string, value: number, color: string }) {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setWidth(value * 100), 300);
        return () => clearTimeout(t);
    }, [value]);

    return (
        <div>
            <div className="flex justify-between mb-2 text-sm font-medium text-slate-600">
                <span>{label}</span>
                <span className="text-slate-900 font-bold">{(value * 100).toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-[1500ms] ease-out ${color}`}
                    style={{ width: `${width}%` }}
                ></div>
            </div>
        </div>
    )
}