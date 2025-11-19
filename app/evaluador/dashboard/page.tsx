"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  User, ClipboardList, CheckCircle, Hourglass, 
  Activity, RefreshCw 
} from "lucide-react";

export default function Dashboard() {
  const [preclientes, setPreclientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Función de carga extraída para poder reusarla en el botón
  const loadData = useCallback(async () => {
    try {
      // Si ya estamos cargando (primera vez), no activamos el refreshing
      if (!loading) setRefreshing(true);
      
      const res = await fetch("/api/scorin_risk/pre_clientes");
      const data = await res.json();
      setPreclientes(data);
    } catch (e) {
      console.error("Error al cargar preclientes", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  // Carga inicial
  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPreclientes = preclientes.length;

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">

      {/* --- HEADER CON BOTÓN DE RECARGA --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          {/* Título con gradiente sutil */}
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
            ZidraScore
          </h1>
          <p className="text-slate-500 mt-2 text-base font-medium">
            Panel General · Preclientes y Riesgo
          </p>
        </div>

        <button 
          onClick={loadData}
          disabled={refreshing || loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-600 font-semibold hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Actualizando..." : "Actualizar Datos"}
        </button>
      </div>

      {/* --- TARJETAS PRINCIPALES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <MetricCard
          title="Preclientes Registrados"
          value={totalPreclientes}
          icon={<User className="w-6 h-6" />}
          color="indigo"
          loading={loading}
          active={true} // Este sí tiene datos reales
        />
        <MetricCard
          title="Total Solicitudes"
          value="—"
          icon={<ClipboardList className="w-6 h-6" />}
          color="slate"
          loading={loading}
          subtext="Próximamente"
        />
        <MetricCard
          title="Aprobadas"
          value="—"
          icon={<CheckCircle className="w-6 h-6" />}
          color="slate"
          loading={loading}
          subtext="Próximamente"
        />
        <MetricCard
          title="En Evaluación"
          value="—"
          icon={<Hourglass className="w-6 h-6" />}
          color="slate"
          loading={loading}
          subtext="Próximamente"
        />
      </div>

      {/* --- TABLA DE PRECLIENTES --- */}
      <div className="space-y-6">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" /> Últimos Registros
              </h2>
              <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                {totalPreclientes} registros
              </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {loading ? (
                  <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium animate-pulse">Sincronizando base de datos...</span>
                  </div>
              ) : preclientes.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 italic">
                    No hay preclientes registrados aún.
                  </div>
              ) : (
                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm">
                              <tr>
                                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[80px]">ID</th>
                                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">DNI</th>
                                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ubicación</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {preclientes.slice(0, 6).map((p: any) => (
                                  <tr key={p.id} className="hover:bg-indigo-50/40 transition-colors group cursor-default">
                                      <td className="px-6 py-4">
                                        <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded group-hover:bg-white group-hover:text-indigo-500 transition-colors">
                                            #{p.id}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                              {/* Avatar con iniciales */}
                                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold border border-white shadow-sm">
                                                  {p.nombre?.charAt(0)}{p.apellido?.charAt(0)}
                                              </div>
                                              <div className="font-bold text-slate-700 text-sm group-hover:text-indigo-900 transition-colors">
                                                  {p.nombre} {p.apellido}
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4 text-sm font-mono text-slate-500 font-medium">
                                        {p.numeroDni}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-slate-500">
                                          {p.distrito || "—"}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>
      </div>

    </div>
  );
}

// --- COMPONENTE AUXILIAR DE TARJETA MEJORADO ---
function MetricCard({ title, value, icon, color, loading, active, subtext }: any) {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    slate: "bg-slate-50 text-slate-400 border-slate-100 grayscale opacity-80", // Estilo para cards vacías
  };

  const theme = colors[color] || colors.slate;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl border ${theme} transition-transform group-hover:scale-110 duration-300`}>
          {icon}
        </div>
      </div>
      
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        
        {loading ? (
            <div className="h-9 w-24 bg-slate-100 rounded animate-pulse mt-1"></div>
        ) : (
            <h4 className={`text-3xl font-extrabold tracking-tight ${active ? 'text-slate-900' : 'text-slate-300'}`}>
                {value}
            </h4>
        )}

        {subtext && <p className="text-[10px] font-medium text-slate-400 mt-2 bg-slate-50 w-fit px-2 py-0.5 rounded">{subtext}</p>}
      </div>
    </div>
  );
}