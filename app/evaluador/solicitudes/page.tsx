"use client";

import { useEffect, useState } from "react";
import { 
  Loader2, Search, Filter, Calendar, User, 
  ChevronRight, Eye, FileText 
} from "lucide-react";
import { Solicitud } from "@/interface/scorin/solicitud";

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSolicitudes() {
      try {
        const res = await fetch("/api/scorin_risk/solicitudes");
        const data = await res.json();
        setSolicitudes(data);
      } catch (err) {
        console.error("Error cargando solicitudes", err);
      }
      setLoading(false);
    }
    loadSolicitudes();
  }, []);

  // FILTROS
  const filtered = solicitudes.filter((sol) => {
    const matchEstado =
      estado === "Todos" ||
      sol.estadoPredicente.toLowerCase() === estado.toLowerCase();

    const matchSearch =
      sol.id.toString().includes(search) ||
      (sol.preClienteNombre || "").toLowerCase().includes(search.toLowerCase());

    return matchEstado && matchSearch;
  });

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">

      {/* --- HEADER --- */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Solicitudes de Crédito
        </h1>
      </div>
 
      {/* --- BARRA DE FILTROS --- */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          {/* Input Búsqueda */}
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">Buscar</label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                type="text"
                placeholder="ID o nombre del cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                />
            </div>
          </div>

          {/* Select Estado */}
          <div className="relative">
             <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">Estado</label>
             <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all text-sm font-medium cursor-pointer"
                >
                    <option>Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                </select>
                {/* Flechita custom para el select */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-400"></div>
                </div>
             </div>
          </div>

          {/* Input Fecha */}
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">Fecha Solicitud</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                type="date"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-slate-600"
                />
            </div>
          </div>

          {/* Select Asesor */}
          <div className="relative">
             <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block ml-1">Asesor</label>
             <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all text-sm font-medium cursor-pointer">
                    <option>Todos</option>
                    <option value="77">Usuario 77</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-400"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- TABLA --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" /> 
            <span className="font-medium animate-pulse">Cargando datos...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[100px]">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pre-Cliente</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                            No se encontraron solicitudes con estos filtros.
                        </td>
                    </tr>
                ) : filtered.map((sol) => (
                  <tr
                    key={sol.id}
                    className="hover:bg-blue-50/30 transition-colors duration-200 group"
                  >
                    <td className="px-6 py-5">
                        <div className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded w-fit text-xs">
                            #{sol.id}
                        </div>
                    </td>
                    
                    <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                {sol.preClienteNombre ? sol.preClienteNombre.charAt(0) : "U"}
                            </div>
                            <span className="font-bold text-slate-800 text-sm">
                                {sol.preClienteNombre || "Sin Nombre"}
                            </span>
                        </div>
                    </td>

                    <td className="px-6 py-5">
                        <span className="font-bold text-slate-700">
                            S/ {sol.montoTotal?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </span>
                    </td>

                    <td className="px-6 py-5">
                      <BadgeEstado estado={sol.estadoPredicente} />
                    </td>

                    <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(sol.fechaSolicitud).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <a
                        href={`/evaluador/solicitudes/${sol.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-all group-hover:shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalle
                      </a>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Componente UI para el Badge ---
function BadgeEstado({ estado }: { estado: string }) {
    const normalized = estado?.toLowerCase() || "";
    
    let styles = "bg-slate-100 text-slate-600 border-slate-200"; // Default
    let icon = <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></div>;

    if (normalized === "aprobado") {
        styles = "bg-emerald-50 text-emerald-700 border-emerald-100";
        icon = <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>;
    } else if (normalized === "rechazado") {
        styles = "bg-red-50 text-red-700 border-red-100";
        icon = <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>;
    } else if (normalized === "pendiente") {
        styles = "bg-amber-50 text-amber-700 border-amber-100";
        icon = <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></div>;
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
            {icon}
            <span className="capitalize">{normalized}</span>
        </span>
    );
}