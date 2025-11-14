"use client";
import { useState } from "react";

export default function Solicitudes() {
    const [search, setSearch] = useState("");
    const [estado, setEstado] = useState("Todos");

    const solicitudes = [
        {
            id: "SOL-00123",
            cliente: "Juan Rodríguez",
            monto: "S/10,000.00",
            estado: "Aprobado",
            riesgo: "15%",
            fecha: "2023-10-26",
        },
        {
            id: "SOL-00124",
            cliente: "María García",
            monto: "S/5,000.00",
            estado: "Pendiente",
            riesgo: "42%",
            fecha: "2023-10-25",
        },
        {
            id: "SOL-00125",
            cliente: "Carlos Martínez",
            monto: "S/25,000.00",
            estado: "Rechazado",
            riesgo: "78%",
            fecha: "2023-10-24",
        },
        {
            id: "SOL-00126",
            cliente: "Laura Hernández",
            monto: "S/12,000.00",
            estado: "Aprobado",
            riesgo: "21%",
            fecha: "2023-10-23",
        },
        {
            id: "SOL-00127",
            cliente: "Pedro López",
            monto: "S/8,500.00",
            estado: "Pendiente",
            riesgo: "33%",
            fecha: "2023-10-22",
        },
    ];

    const filteredSolicitudes = solicitudes.filter(
        (solicitud) =>
            (estado === "Todos" || solicitud.estado === estado) &&
            solicitud.cliente.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-background text-foreground">
            <h1 className="text-2xl font-bold mb-4">Solicitudes de Crédito</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Gestiona y revisa todas las solicitudes de crédito.
            </p>

            {/* Filtros */}
            <div className="flex items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Buscar por DNI, nombre, ID de solicitud..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-input text-foreground placeholder-muted-foreground"
                />
                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-input text-foreground"
                >
                    <option value="Todos">Estado: Todos</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Rechazado">Rechazado</option>
                </select>
                <input
                    type="date"
                    className="px-4 py-2 border rounded-lg bg-input text-foreground"
                />
                <select className="px-4 py-2 border rounded-lg bg-input text-foreground">
                    <option value="Todos">Asesor: Todos</option>
                    <option value="Asesor 1">Asesor 1</option>
                    <option value="Asesor 2">Asesor 2</option>
                </select>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-muted">
                    <thead>
                        <tr className="bg-muted text-muted-foreground">
                            <th className="px-4 py-2 border border-muted">ID Solicitud</th>
                            <th className="px-4 py-2 border border-muted">Pre-Cliente</th>
                            <th className="px-4 py-2 border border-muted">Monto Solicitado</th>
                            <th className="px-4 py-2 border border-muted">Estado</th>
                            <th className="px-4 py-2 border border-muted">Riesgo ML (%)</th>
                            <th className="px-4 py-2 border border-muted">Fecha Creación</th>
                            <th className="px-4 py-2 border border-muted">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSolicitudes.map((solicitud) => (
                            <tr key={solicitud.id} className="hover:bg-muted">
                                <td className="px-4 py-2 border border-muted">{solicitud.id}</td>
                                <td className="px-4 py-2 border border-muted">{solicitud.cliente}</td>
                                <td className="px-4 py-2 border border-muted">{solicitud.monto}</td>
                                <td
                                    className={`px-4 py-2 border border-muted ${
                                        solicitud.estado === "Aprobado"
                                            ? "text-green-500"
                                            : solicitud.estado === "Pendiente"
                                            ? "text-yellow-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {solicitud.estado}
                                </td>
                                <td className="px-4 py-2 border border-muted">{solicitud.riesgo}</td>
                                <td className="px-4 py-2 border border-muted">{solicitud.fecha}</td>
                                <td className="px-4 py-2 border border-muted">
                                    <a
                                        href={`/evaluador/solicitudes/${solicitud.id}`}
                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Ver Detalle
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}