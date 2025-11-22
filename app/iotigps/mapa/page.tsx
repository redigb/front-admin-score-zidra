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
    MapPin,
    Battery,
    Signal,
    Smartphone,
    Radio,
    Clock,
    Cpu,
    Navigation,
    Layers

} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGpsWebSocket } from "@/hooks/useGpsWebSocket";
import { GpsTelemetria } from "@/interface/telemetria-dispostivo";
import { ScrollArea } from "@/components/ui/scroll-area"; // Asegúrate de tener este o usa un div con overflow-auto



// --- Cargas Dinámicas (Sin cambios funcionales) ---
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });
const DevicePopup = dynamic(() => import("@/components/my_components/map/DevicePopup").then((mod) => ({ default: mod.DevicePopup })), { ssr: false });



export default function MapaDispositivos() {

    const { data: dispositivos = [], isLoading: loadingDispositivos } = useDispositivos();
    const [selectedDevice, setSelectedDevice] = useState<Dispositivo | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [breathingIcon, setBreathingIcon] = useState<any>(null);
    const [isClient, setIsClient] = useState(false);

    // Lógica de Cliente y WebSockets (Intacta)
    useEffect(() => {
        setIsClient(true);
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


    useEffect(() => {
        if (!isClient) return;
        import("@/components/my_components/map/DevicePopup").then((mod) => {
            setBreathingIcon(() => mod.createBreathingIcon);
        });
    }, [isClient]);



    useEffect(() => {
        if (!selectedDevice && dispositivos.length > 0) {
            setSelectedDevice(dispositivos[0]);
        }
    }, [dispositivos, selectedDevice]);


    const { data: ultimaTelemetria, isLoading: loadingTelemetria } = useLastTelemetriaByDevice(selectedDevice?.id ?? 0);


    const filteredDevices = dispositivos.filter((d) =>
        d.deviceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.imei.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [useWebSocket, setUseWebSocket] = useState(false);
    const [liveTelemetria, setLiveTelemetria] = useState<GpsTelemetria | null>(null);


    useGpsWebSocket(
        selectedDevice?.id ?? null,
        (tele) => setLiveTelemetria(tele),
        useWebSocket // boolean
    );


    const currentTelemetria = liveTelemetria || ultimaTelemetria;
    if (!isClient) return <div className="flex h-screen w-full items-center justify-center bg-slate-50"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>;



    return (

        <div className="flex h-screen w-full bg-slate-100 font-sans text-slate-900 overflow-hidden">
            {/* ================= SIDEBAR DE LUJO ================= */}
            <div className="w-full md:w-[400px] h-full bg-white flex flex-col z-30 shadow-[4px_0_24px_rgba(0,0,0,0.05)] border-r border-slate-200/60 relative">
                {/* Header Sidebar */}
                <div className="px-6 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                            <Radio className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Monitoreo de dispositivos</h1>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Monitoreo de productos getionados por gps-IOTI</p>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <Input
                            placeholder="Buscar por IMEI, Modelo o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Lista de Dispositivos */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                    {loadingDispositivos ? (

                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">

                            <Loader2 className="h-8 w-8 animate-spin text-blue-500/50" />

                            <span className="text-sm font-medium">Sincronizando flota...</span>

                        </div>

                    ) : filteredDevices.length === 0 ? (

                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 opacity-60">

                            <Layers className="h-12 w-12 mb-3 stroke-1" />

                            <p className="text-sm">Sin resultados</p>

                        </div>

                    ) : (

                        filteredDevices.map((device) => {
                            const isSelected = selectedDevice?.id === device.id;
                            const isOnline = device.status === "ONLINE";
                            return (
                                <div
                                    key={device.id}
                                    onClick={() => setSelectedDevice(device)}
                                    className={`
                                        group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border
                                        ${isSelected
                                            ? "bg-white border-blue-500/30 shadow-[0_8px_20px_-6px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20 z-10 scale-[1.02]"
                                            : "bg-white border-slate-200/60 hover:border-blue-300 hover:shadow-md"
                                        }
                                    `}
                                >

                                    {/* Indicador lateral de selección */}
                                    {isSelected && <div className="absolute left-0 top-4 bottom-4 w-1 bg-blue-500 rounded-r-full" />}
                                    <div className="flex justify-between items-start mb-3 pl-2">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 text-sm leading-tight group-hover:text-blue-700 transition-colors">
                                                {device.modelo}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-400 mt-1 tracking-wide">
                                                IMEI: {device.imei}
                                            </span>
                                        </div>

                                        {/* Badge de Estado Minimalista */}
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${isOnline ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                            {isOnline ? "ONLINE" : "OFFLINE"}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pl-2 border-t border-slate-50 pt-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                                <Cpu className="w-3 h-3" />
                                                <span>v{device.versionFirmware || "1.0"}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                                <Navigation className="w-3 h-3" />
                                                <span>#{device.id}</span>
                                            </div>
                                        </div>
                                        {isOnline && <Wifi className="h-3.5 w-3.5 text-blue-500" />}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ================= MAPA & HUD ================= */}
            <div className="flex-1 relative h-full w-full bg-slate-200 overflow-hidden">
                {/* Capa del Mapa */}
                <div className="absolute inset-0 z-0">
                    {loadingTelemetria ? (
                        <div className="h-full w-full flex items-center justify-center bg-slate-100/80 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-slate-500 animate-pulse">Localizando unidad...</p>
                            </div>
                        </div>
                    ) : !currentTelemetria ? (
                        <div className="h-full w-full flex items-center justify-center bg-slate-100">
                            <div className="text-center p-8 max-w-xs">
                                <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                                    <Signal className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700">Señal GPS no detectada</h3>
                                <p className="text-sm text-slate-500 mt-2">El dispositivo no está reportando coordenadas válidas actualmente.</p>
                            </div>
                        </div>

                    ) : (
                        breathingIcon && (
                            <MapContainer
                                center={[currentTelemetria.latitud, currentTelemetria.longitud]}
                                zoom={16}
                                className="h-full w-full outline-none"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap contributors'
                                />
                                <Marker
                                    position={[currentTelemetria.latitud, currentTelemetria.longitud]}
                                    icon={breathingIcon()}
                                >
                                    <Popup>
                                        <DevicePopup device={selectedDevice} telemetria={currentTelemetria} />
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        )
                    )}
                </div>

                {/* ================= PANEL FLOTANTE (HUD) ================= */}
                {selectedDevice && (
                    <div className="absolute top-6 right-6 z-[1000] w-80 flex flex-col gap-4 pointer-events-none">
                        {/* Card 1: Estado Principal */}
                        <div className="pointer-events-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 overflow-hidden animate-in slide-in-from-right-4 duration-500">
                            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-blue-600" />
                                            Estado del Sistema
                                        </h2>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-wide">
                                            {selectedDevice.modelo}
                                        </p>
                                    </div>
                                    {selectedDevice.status === "ONLINE" ? (
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/30 text-[10px] px-2">
                                            EN LÍNEA
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-slate-200 text-slate-600 text-[10px]">
                                            OFFLINE
                                        </Badge>
                                    )}
                                </div>

                                {/* Grid de Info Rápida */}
                                <div className="grid grid-cols-2 gap-3">
                                    <InfoItem icon={<Smartphone />} label="Operador" value={selectedDevice.simOperador} />
                                    <InfoItem icon={<Radio />} label="Plan" value={selectedDevice.simPlan} />
                                    <div className="col-span-2">
                                        <InfoItem icon={<Cpu />} label="SIM ID" value={selectedDevice.simNumeroTelefono} fullWidth />
                                    </div>
                                </div>



                                {/* Botón de Acción */}
                                {selectedDevice.status === "ONLINE" && (
                                    <div className="mt-5 pt-4 border-t border-slate-100">
                                        <Button

                                            onClick={() => setUseWebSocket(!useWebSocket)}
                                            className={`w-full rounded-xl h-10 text-xs font-bold tracking-wide shadow-md transition-all duration-300 ${useWebSocket
                                                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
                                                : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
                                                }`}

                                        >
                                            {useWebSocket ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                    </span>
                                                    DETENER RASTREO
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Zap className="w-3.5 h-3.5" />
                                                    ACTIVAR SEGUIMIENTO EN VIVO
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                )}

                            </div>

                        </div>



                        {/* Card 2: Telemetría Detallada (Bento Grid) */}

                        {currentTelemetria?.extraData && (

                            <div className="pointer-events-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 p-4 animate-in slide-in-from-right-4 duration-700 delay-75">

                                <div className="flex items-center gap-2 mb-3">

                                    <div className="p-1 bg-blue-100 rounded text-blue-600">

                                        <Layers className="w-3 h-3" />

                                    </div>

                                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Telemetría</h3>

                                </div>



                                <div className="grid grid-cols-2 gap-2">

                                    {Object.entries(currentTelemetria.extraData)

                                        .filter(([key]) => !["altitud", "lat", "lng"].includes(key.toLowerCase()))

                                        .map(([key, value]) => (

                                            <div key={key} className="bg-white/60 p-2.5 rounded-xl border border-slate-100 flex flex-col items-start gap-1 shadow-sm">

                                                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">

                                                    {getIconByKey(key)}

                                                    {key}

                                                </span>

                                                <span className="text-sm font-bold text-slate-800 truncate w-full font-mono">

                                                    {value?.toString()}

                                                </span>

                                            </div>

                                        ))}

                                </div>

                                <div className="mt-3 flex justify-end">

                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">

                                        <Clock className="w-3 h-3" /> Actualizado hace un momento

                                    </span>

                                </div>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </div>

    );

}



// --- Componentes Auxiliares de UI ---

function InfoItem({ icon, label, value, fullWidth = false }: { icon: any, label: string, value: string, fullWidth?: boolean }) {

    return (

        <div className={`flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 ${fullWidth ? 'w-full' : ''}`}>

            <div className="text-slate-400 [&>svg]:w-4 [&>svg]:h-4">

                {icon}

            </div>

            <div className="flex flex-col leading-none">

                <span className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5">{label}</span>

                <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">{value}</span>

            </div>

        </div>

    );

}



function getIconByKey(key: string) {

    const k = key.toLowerCase();

    if (k.includes("bat")) return <Battery className="w-3 h-3 text-emerald-500" />;

    if (k.includes("sig") || k.includes("rssi")) return <Signal className="w-3 h-3 text-blue-500" />;

    if (k.includes("temp")) return <Activity className="w-3 h-3 text-amber-500" />;

    return <Zap className="w-3 h-3 text-slate-400" />;

}