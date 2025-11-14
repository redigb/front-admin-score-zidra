"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispositivos } from "@/hooks/use-fetch-dipositivos";
import { useLastTelemetriaByDevice } from "@/hooks/use-fetch-telemetria";
import { Dispositivo } from "@/interface/dispositivos";
import {
    Search,
    Loader2,
    Wifi,
    WifiOff,
    Zap,
    Activity,
    AlertTriangle,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGpsWebSocket } from "@/hooks/useGpsWebSocket";
import { GpsTelemetria } from "@/interface/telemetria-dispostivo";

// 🔥 Importar React-Leaflet completamente dinámico
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

// 🔥 Importar DevicePopup dinámicamente
const DevicePopup = dynamic(
  () => import("@/components/my_components/map/DevicePopup").then((mod) => ({ default: mod.DevicePopup })),
  { ssr: false }
);

export default function MapaDispositivos() {
    const { data: dispositivos = [], isLoading: loadingDispositivos } = useDispositivos();
    const [selectedDevice, setSelectedDevice] = useState<Dispositivo | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [breathingIcon, setBreathingIcon] = useState<any>(null);
    const [isClient, setIsClient] = useState(false);

    // Detectar cliente y cargar Leaflet CSS
    useEffect(() => {
        setIsClient(true);
        
        // Cargar CSS de Leaflet dinámicamente
        if (typeof window !== 'undefined' && !document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = '';
            document.head.appendChild(link);
        }
    }, []);

    // Cargar icono dinámicamente
    useEffect(() => {
        if (!isClient) return;
        
        import("@/components/my_components/map/DevicePopup").then((mod) => {
            setBreathingIcon(() => mod.createBreathingIcon);
        });
    }, [isClient]);

    // Seleccionar automáticamente el primer dispositivo
    useEffect(() => {
        if (!selectedDevice && dispositivos.length > 0) {
            setSelectedDevice(dispositivos[0]);
        }
    }, [dispositivos, selectedDevice]);

    const { data: ultimaTelemetria, isLoading: loadingTelemetria } = 
        useLastTelemetriaByDevice(selectedDevice?.id ?? 0);

    const filteredDevices = dispositivos.filter(
        (d) =>
            d.deviceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.imei.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: "ONLINE" | "OFFLINE") =>
        status === "ONLINE" ? "bg-emerald-500" : "bg-red-500";

    const [useWebSocket, setUseWebSocket] = useState(false);
    const [liveTelemetria, setLiveTelemetria] = useState<GpsTelemetria | null>(null);
    
    useGpsWebSocket(
        selectedDevice?.id ?? null,
        (telemetria) => setLiveTelemetria(telemetria),
        useWebSocket
    );
    
    const currentTelemetria = liveTelemetria || ultimaTelemetria;

    // No renderizar hasta estar en cliente
    if (!isClient) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 h-full border-r bg-white/70 dark:bg-slate-900/70 shadow-xl backdrop-blur-xl flex flex-col">
                <div className="p-6 border-b bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
                    <h1 className="text-2xl font-bold flex items-center gap-3 text-blue-700 dark:text-blue-300">
                        <Zap className="h-5 w-5" /> Dispositivos GPS
                    </h1>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar dispositivo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white/80 border-white/30"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loadingDispositivos ? (
                        <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                            Esperando datos del dispositivo...
                        </div>
                    ) : filteredDevices.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">
                            No se encontraron dispositivos
                        </div>
                    ) : (
                        filteredDevices.map((device) => (
                            <div
                                key={device.id}
                                onClick={() => setSelectedDevice(device)}
                                className={`p-4 cursor-pointer border-b transition-all ${
                                    selectedDevice?.id === device.id
                                        ? "bg-blue-50/80 border-l-4 border-l-blue-500"
                                        : "hover:bg-white/50 dark:hover:bg-slate-800/50"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold">{device.modelo}</h3>
                                        <p className="text-xs text-slate-500">{device.imei}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {device.status === "ONLINE" ? (
                                            <Wifi className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <WifiOff className="h-4 w-4 text-red-500" />
                                        )}
                                        <div
                                            className={`w-3 h-3 rounded-full ${getStatusColor(
                                                device.status
                                            )} animate-pulse`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Mapa principal */}
            <div className="flex-1 flex flex-col">
                {loadingTelemetria ? (
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
                        <div className="text-center p-12 bg-white/60 dark:bg-slate-900/60 rounded-2xl backdrop-blur-xl shadow-2xl border border-white/30">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                <Loader2 className="h-16 w-16 text-white animate-spin" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                Cargando dispositivo ...
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg leading-relaxed">
                                Esperando datos del Gps_IOTI...
                            </p>
                        </div>
                    </div>
                ) : !ultimaTelemetria ? (
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-red-50/40 dark:from-slate-900/40 dark:to-slate-800/40">
                        <div className="text-center p-10 bg-white/70 dark:bg-slate-900/70 rounded-2xl backdrop-blur-xl shadow-lg border border-red-200/40">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                                <AlertTriangle className="h-8 w-8 text-red-500 animate-pulse" />
                            </div>
                            <h2 className="text-xl font-bold mb-3 text-red-600 dark:text-red-400">
                                {selectedDevice?.status === "ONLINE"
                                    ? "Sin ubicación disponible"
                                    : "Dispositivo sin conexión"}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-md text-sm">
                                {selectedDevice?.status === "ONLINE"
                                    ? "✅ El dispositivo está en línea pero aún no ha reportado ubicación."
                                    : "⚠️ Este dispositivo no gestiona ubicaciones o se encuentra fuera de línea."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        {currentTelemetria && breathingIcon ? (
                            <MapContainer
                                center={[currentTelemetria.latitud, currentTelemetria.longitud]}
                                zoom={15}
                                className="flex-1"
                                style={{ width: "100%", height: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; OpenStreetMap"
                                />
                                <Marker
                                    position={[currentTelemetria.latitud, currentTelemetria.longitud]}
                                    icon={breathingIcon()}
                                >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                                        {selectedDevice?.modelo} – {selectedDevice?.imei}
                                    </Tooltip>
                                    <Popup>
                                        <DevicePopup device={selectedDevice} telemetria={currentTelemetria} />
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Panel derecho */}
            {selectedDevice && (
                <div className="w-80 h-full border-l bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl flex flex-col">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-emerald-600" />
                            Panel de Control
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex gap-2 items-center">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" /> Estado
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p><b>Estado:</b> {selectedDevice.status}</p>
                                <p><b>SIM:</b> {selectedDevice.simOperador} – {selectedDevice.simNumeroTelefono}</p>
                                <p><b>Plan:</b> {selectedDevice.simPlan}</p>
                            </CardContent>
                        </Card>

                        {selectedDevice?.status === "ONLINE" && ultimaTelemetria && (
                            <div className="p-4 border-t flex items-center justify-between bg-gradient-to-r from-sky-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-b-2xl">
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-9 h-9 rounded-lg shadow-inner transition-colors ${useWebSocket ? "bg-emerald-50 dark:bg-emerald-900/30" : "bg-rose-50 dark:bg-rose-900/20"}`}>
                                        <Zap className={`h-5 w-5 ${useWebSocket ? "text-emerald-500" : "text-rose-500"}`} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                            Rastrear Cambios
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-300">
                                            {useWebSocket ? "Telemetría en vivo" : "Telemetría"}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setUseWebSocket((prev) => !prev)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-transform transform shadow-lg ${useWebSocket ? "bg-rose-600 text-white hover:scale-105" : "bg-emerald-600 text-white hover:scale-105"}`}
                                >
                                    {useWebSocket ? (
                                        <>
                                            <XCircle className="h-5 w-5" />
                                            <span>Desactivar</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-5 w-5" />
                                            <span>Activar</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {ultimaTelemetria?.extraData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm flex gap-2 items-center">
                                        <Zap className="h-4 w-4 text-blue-600" /> Datos del Dispositivo
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm">
                                        {Object.entries(ultimaTelemetria.extraData)
                                            .filter(([key]) => key.toLowerCase() !== "altitud")
                                            .map(([key, value]) => (
                                                <li key={key} className="flex justify-between items-center border-b border-dashed border-slate-200 dark:border-slate-700 pb-1">
                                                    <span className="capitalize text-slate-600 dark:text-slate-300">{key}</span>
                                                    <span className="font-semibold text-slate-800 dark:text-slate-100">{value?.toString()}</span>
                                                </li>
                                            ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}