"use client";
import { useEffect, useState } from "react";
import {
    Terminal, CheckCircle2, Clock, Server,
    FileCode, Cpu, BarChart3, Activity,
    Database, Layers, Zap
} from "lucide-react";

// --- Tipos de datos ---
interface ActiveModel {
    mode: string;
    version: number;
    rows_train: number;
    rows_valid: number;
    auc: number;
    ks: number;
    f1: number;
    created_at: string;
    decision_threshold: number;
    file: string;
}

interface Step {
    command: string;
    stdout: string;
}

interface TrainingData {
    training: {
        status: string;
        steps: Step[];
        active_model: ActiveModel;
    };
    fecha_de_ejecucion: string;
}

export default function ConstrucionModelo() {
    const [data, setData] = useState<TrainingData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/scorin_risk/modelo/entrenamiento")
            .then((res) => res.json())
            .then((val) => {
                setData(val);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // --- Utilidades ---

    // 1. Limpia colores ANSI de terminal
    const cleanAnsi = (text: string) => text.replace(/\x1b\[[0-9;]*m/g, "");

    // 2. Formatea comandos largos a nombre corto
    const formatCommand = (cmd: string) => {
        const parts = cmd.split(" -m ");
        return parts.length > 1 ? parts[1] : cmd;
    };

    // 3. Parsea fecha en inglés a Español
    const parseAndFormatDate = (dateStr: string) => {
        if (!dateStr) return "";
        // Truco: Quitamos 'st', 'nd', 'rd', 'th' para que JS pueda entender la fecha
        const cleanStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
        const date = new Date(cleanStr);

        // Si falla el parseo, devolvemos original
        if (isNaN(date.getTime())) return dateStr;

        return new Intl.DateTimeFormat('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    const fmtPercent = (n: number) => `${(n * 100).toFixed(2)}%`;

    if (loading) return <div className="p-10 text-slate-500 flex gap-2 items-center justify-center h-screen"><Cpu className="animate-spin" /> Cargando pipeline...</div>;
    if (!data) return <div className="p-10 text-red-500">No se pudieron cargar los logs.</div>;

    const { active_model } = data.training;

    return (
        <div className="p-8 bg-[#F3F7FC] min-h-screen font-sans text-slate-800">

            {/* --- HEADER PRINCIPAL --- */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Terminal className="w-8 h-8 text-slate-700" />
                        Construcción de Modelo
                    </h1>
                    <p className="text-slate-500 mt-1 ml-11 text-sm">
                        Reporte de ejecución del pipeline automatizado de Machine Learning.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600 capitalize">
                            {parseAndFormatDate(data.fecha_de_ejecucion)}
                        </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {data.training.status.replace(/_/g, " ")}
                    </span>
                </div>
            </div>

            {/* --- SECCIÓN: RESULTADO DEL MODELO (NUEVO) --- */}
            <div className="bg-white max-w-5xl mx-auto rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-bold text-slate-800">Modelo Generado (v{active_model.version})</h2>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 ml-auto">
                        Mode: {active_model.mode.toUpperCase()}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Métricas Clave */}
                    <StatBox label="AUC Score" value={fmtPercent(active_model.auc)} icon={<Activity className="w-4 h-4 text-blue-500" />} />
                    <StatBox label="KS Score" value={fmtPercent(active_model.ks)} icon={<BarChart3 className="w-4 h-4 text-indigo-500" />} />

                    {/* Datos de Entrenamiento */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1 text-xs text-slate-500 font-medium uppercase tracking-wide">
                            <Database className="w-3.5 h-3.5" /> Datos
                        </div>
                        <div className="font-mono text-sm text-slate-700">
                            <span className="font-bold">{active_model.rows_train}</span> <span className="text-slate-400">train</span>
                        </div>
                        <div className="font-mono text-sm text-slate-700">
                            <span className="font-bold">{active_model.rows_valid}</span> <span className="text-slate-400">valid</span>
                        </div>
                    </div>

                    {/* Configuración */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1 text-xs text-slate-500 font-medium uppercase tracking-wide">
                            <Layers className="w-3.5 h-3.5" /> Config
                        </div>
                        <div className="text-sm text-slate-700">
                            Umbral: <span className="font-bold">{active_model.decision_threshold}</span>
                        </div>
                        <div className="text-xs text-slate-400 truncate" title={active_model.file}>
                            File: {active_model.file}
                        </div>
                    </div>
                </div>
            </div>


            {/* --- SECCIÓN: LOGS (TIMELINE) --- */}
            <div className="max-w-5xl mx-auto space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-8 mb-4">Traza de Ejecución</h3>

                {data.training.steps.map((step, index) => {
                    const isLast = index === data.training.steps.length - 1;
                    const moduleName = formatCommand(step.command);

                    return (
                        <div key={index} className="relative pl-8 group">
                            {/* Línea conectora vertical */}
                            {!isLast && (
                                <div className="absolute left-[11px] top-8 h-full w-0.5 bg-slate-200 group-hover:bg-blue-200 transition-colors"></div>
                            )}

                            {/* Bullet point */}
                            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center z-10 shadow-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>

                            {/* Card del Log */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Server className="w-4 h-4 text-slate-400" />
                                        <span className="font-mono text-sm font-semibold text-slate-700">
                                            {moduleName}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] p-4 overflow-x-auto">
                                    <pre className="font-mono text-xs leading-relaxed text-emerald-400 whitespace-pre-wrap">
                                        {cleanAnsi(step.stdout).trim()}
                                    </pre>
                                    {step.stdout.includes("[SAVE]") && (
                                        <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-2 text-blue-300 text-[10px]">
                                            <FileCode className="w-3 h-3" />
                                            <span>Artefacto guardado en disco</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Indicador de fin */}
                <div className="pl-8 pt-2 pb-10 flex items-center gap-2 opacity-50">
                    <div className="w-6 flex justify-center"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div></div>
                    <span className="text-xs text-slate-400">Fin del log</span>
                </div>

            </div>
        </div>
    );
}

// Componente auxiliar simple para métricas
function StatBox({ label, value, icon }: any) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1 text-xs text-slate-500 font-medium uppercase tracking-wide">
                {icon} {label}
            </div>
            <div className="text-2xl font-bold text-slate-800 tracking-tight">
                {value}
            </div>
        </div>
    )
}