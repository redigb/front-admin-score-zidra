"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    MapPin,
    Search,
    RefreshCw,
    Save,
    Battery,
    Signal,
    Activity,
    Zap,
    AlertTriangle,
    Wifi,
    WifiOff,
    Loader2,
} from "lucide-react"

interface Location {
    lat: number;
    lng: number;
    timestamp: string;
    status: string;
}

interface Data {
    velocidad: string;
    combustible: string;
}

interface Device {
    id: string;
    name: string;
    type: string;
    status: string;
    locations: Location[];
    battery: number;
    signal: number;
    lastUpdate: string;
    data: Data;
}

export function LocationsDashboard() {

    const [devices, setDevices] = useState<Device[]>([])
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true) // Estado para indicar carga inicial

    // Conectar al WebSocket
 // Conectar al WebSocket
    useEffect(() => {
        const ws = new WebSocket("ws://192.168.31.120:3005/ws")

        ws.onopen = () => {
            console.log("Conectado al WebSocket")
            setIsLoading(true)
        }

        ws.onmessage = (event) => {
            const raw = JSON.parse(event.data)

            // Adaptar datos que llegan del backend a la estructura Device
            const data: Device = {
                id: String(raw.gps_device_id),
                name: `Dispositivo ${raw.gps_device_id}`,
                type: "GPS",
                status: raw.estado_encendido ? "online" : "offline",
                locations: [
                    {
                        lat: raw.latitud,
                        lng: raw.longitud,
                        timestamp: raw.timestamp,
                        status: raw.extra_data?.status ?? "desconocido",
                    },
                ],
                battery: raw.extra_data?.bateria ?? 0,
                signal: raw.extra_data?.senal ?? 0,
                lastUpdate: raw.timestamp,
                data: {
                    velocidad: raw.speed?.toString() ?? "0",
                    combustible: raw.extra_data?.fuente ?? "N/A",
                },
            }

            setDevices((prevDevices) => {
                const existingDeviceIndex = prevDevices.findIndex((d) => d.id === data.id)
                let updatedDevices: Device[]

                if (existingDeviceIndex !== -1) {
                    updatedDevices = [...prevDevices]
                    // Agregar nueva ubicación al historial
                    updatedDevices[existingDeviceIndex].locations.push(data.locations[0])
                    // Actualizar info del dispositivo
                    updatedDevices[existingDeviceIndex] = {
                        ...updatedDevices[existingDeviceIndex],
                        ...data,
                    }
                } else {
                    updatedDevices = [...prevDevices, data]
                }

                if (!selectedDevice || selectedDevice.id === data.id) {
                    setSelectedDevice(data)
                }

                setIsLoading(false)
                return updatedDevices
            })
        }

        ws.onclose = () => {
            console.log("WebSocket desconectado")
            setIsLoading(true)
        }

        ws.onerror = (error) => {
            console.error("Error en WebSocket:", error)
            setIsLoading(true)
        }

        return () => {
            ws.close()
        }
    }, [selectedDevice])

    const filteredDevices = devices.filter(
        (device) =>
            device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    console.log(filteredDevices);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online":
                return "bg-emerald-500"
            case "offline":
                return "bg-red-500"
            case "warning":
                return "bg-amber-500"
            default:
                return "bg-slate-500"
        }
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="w-80 border-r border-white/20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl">
                <div className="p-6 border-b border-white/20 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 backdrop-blur-sm">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        Artefactos de Rastreo
                    </h1>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar artefacto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white/80 border-white/30 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-140px)]">
                    {isLoading && filteredDevices.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                            Esperando datos del dispositivo...
                        </div>
                    ) : filteredDevices.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                            No se encontraron dispositivos
                        </div>
                    ) : (
                        filteredDevices.map((device) => (
                            <div
                                key={device.id}
                                className={`p-5 border-b border-white/10 cursor-pointer hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300 ${selectedDevice?.id === device.id
                                    ? "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-slate-800/80 dark:to-slate-700/80 border-l-4 border-l-blue-500 shadow-lg backdrop-blur-sm"
                                    : ""
                                    }`}
                                onClick={() => setSelectedDevice(device)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{device.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100/50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                                            {device.id}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {device.status === "online" ? (
                                            <Wifi className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <WifiOff className="h-4 w-4 text-red-500" />
                                        )}
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)} shadow-lg animate-pulse`} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <Badge
                                        variant="secondary"
                                        className="text-xs bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 dark:from-slate-700 dark:to-slate-600 dark:text-slate-300 border-0 shadow-sm"
                                    >
                                        {device.type}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="text-xs border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/20"
                                    >
                                        {device.locations.length} ubicaciones
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-2 p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg backdrop-blur-sm">
                                        <Battery
                                            className={`h-4 w-4 ${device.battery > 50 ? "text-emerald-500" : device.battery > 20 ? "text-amber-500" : "text-red-500"}`}
                                        />
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{device.battery}%</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg backdrop-blur-sm">
                                        <Signal
                                            className={`h-4 w-4 ${device.signal > 70 ? "text-emerald-500" : device.signal > 30 ? "text-amber-500" : "text-red-500"}`}
                                        />
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{device.signal}%</span>
                                    </div>
                                </div>

                                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                                    Actualizado {device.lastUpdate}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                {selectedDevice ? (
                    <>
                        <div className="p-6 border-b border-white/20 bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                        {selectedDevice.name}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono bg-slate-100/50 dark:bg-slate-800/50 px-3 py-1 rounded-full mt-1 inline-block">
                                        {selectedDevice.id}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-lg backdrop-blur-sm border border-white/20">
                                        <Battery
                                            className={`h-5 w-5 ${selectedDevice.battery > 50 ? "text-emerald-500" : selectedDevice.battery > 20 ? "text-amber-500" : "text-red-500"}`}
                                        />
                                        <span className="font-bold text-lg">{selectedDevice.battery}%</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-lg backdrop-blur-sm border border-white/20">
                                        <Signal
                                            className={`h-5 w-5 ${selectedDevice.signal > 70 ? "text-emerald-500" : selectedDevice.signal > 30 ? "text-amber-500" : "text-red-500"}`}
                                        />
                                        <span className="font-bold text-lg">{selectedDevice.signal}%</span>
                                    </div>
                                    <div
                                        className={`w-6 h-6 rounded-full ${getStatusColor(selectedDevice.status)} shadow-lg animate-pulse`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50 p-6">
                            <div className="h-full bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-white/30 shadow-2xl overflow-hidden backdrop-blur-xl">
                                <div className="p-6 border-b border-white/20 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                                                <MapPin className="h-5 w-5 text-white" />
                                            </div>
                                            Mapa de Rastreo
                                        </h3>
                                        <Badge
                                            variant="outline"
                                            className="border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/20 px-4 py-2 text-sm font-semibold"
                                        >
                                            {selectedDevice.locations.length} puntos registrados
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-6 h-[calc(100%-100px)] relative">
                                    <div className="relative h-full bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-slate-800/80 dark:to-slate-700/80 rounded-xl border-2 border-dashed border-blue-300/50 dark:border-slate-600/50 overflow-hidden backdrop-blur-sm shadow-inner">
                                        <div className="absolute inset-0 p-8">
                                            {selectedDevice.locations.map((location, index) => {
                                                const x = 15 + ((index * 30) % 70)
                                                const y = 15 + ((index * 20) % 60)
                                                return (
                                                    <div key={index} className="absolute group">
                                                        <div
                                                            className={`absolute w-8 h-8 rounded-full cursor-pointer transition-all duration-500 ${selectedLocation === index
                                                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 scale-150 shadow-2xl ring-4 ring-blue-200/50 z-20"
                                                                : location.status.includes("validado") || location.status.includes("aprobado")
                                                                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 hover:scale-125 shadow-lg"
                                                                    : location.status.includes("Fuera") || location.status.includes("baja")
                                                                        ? "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 hover:scale-125 shadow-lg"
                                                                        : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 hover:scale-125 shadow-lg"
                                                                } border-2 border-white/50 backdrop-blur-sm`}
                                                            style={{ left: `${x}%`, top: `${y}%` }}
                                                            onClick={() => setSelectedLocation(selectedLocation === index ? null : index)}
                                                        />

                                                        {index < selectedDevice.locations.length - 1 && (
                                                            <div
                                                                className="absolute w-1 bg-gradient-to-b from-blue-400/60 to-indigo-400/60 dark:from-blue-500/60 dark:to-indigo-500/60 rounded-full shadow-sm"
                                                                style={{
                                                                    left: `${x + 2}%`,
                                                                    top: `${y + 2}%`,
                                                                    height: `${Math.abs(15 + (((index + 1) * 20) % 60) - y)}%`,
                                                                    transform: `rotate(${(Math.atan2(15 + (((index + 1) * 20) % 60) - y, 15 + (((index + 1) * 30) % 70) - x) * 180) / Math.PI}deg)`,
                                                                    transformOrigin: "top left",
                                                                }}
                                                            />
                                                        )}

                                                        {selectedLocation === index && (
                                                            <div
                                                                className="absolute z-30 bg-white/95 dark:bg-slate-800/95 p-4 rounded-xl shadow-2xl border border-white/30 min-w-72 backdrop-blur-xl"
                                                                style={{ left: `${x + 4}%`, top: `${y - 10}%` }}
                                                            >
                                                                <div className="flex items-start gap-3 mb-3">
                                                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                                                                        <MapPin className="h-4 w-4 text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-slate-800 dark:text-slate-100">
                                                                            Ubicación {index + 1}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-md mt-1">
                                                                            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <Badge
                                                                        variant={
                                                                            location.status.includes("validado") || location.status.includes("aprobado")
                                                                                ? "default"
                                                                                : "secondary"
                                                                        }
                                                                        className="text-xs font-semibold"
                                                                    >
                                                                        {location.status}
                                                                    </Badge>
                                                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                                        {location.timestamp}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/30">
                                            <h4 className="text-sm font-bold mb-3 text-slate-700 dark:text-slate-300">Leyenda del Mapa</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-sm"></div>
                                                    <span className="text-slate-600 dark:text-slate-400 font-medium">Pago/Crédito validado</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-sm"></div>
                                                    <span className="text-slate-600 dark:text-slate-400 font-medium">En verificación</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-sm"></div>
                                                    <span className="text-slate-600 dark:text-slate-400 font-medium">Fuera de zona/Error</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/20 bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-xl">
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-slate-200 hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-lg px-6"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Actualizar Rastreo
                                </Button>
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl px-8"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Guardar Cambios
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
                        <div className="text-center p-12 bg-white/60 dark:bg-slate-900/60 rounded-2xl backdrop-blur-xl shadow-2xl border border-white/30">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                {isLoading ? (
                                    <Loader2 className="h-16 w-16 text-white animate-spin" />
                                ) : (
                                    <MapPin className="h-16 w-16 text-white" />
                                )}
                            </div>
                            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                {isLoading ? "Conectando al Dispositivo..." : "Selecciona un Artefacto"}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg leading-relaxed">
                                {isLoading
                                    ? "Esperando datos del rastreador de electrodomésticos..."
                                    : "Elige un artefacto de la lista para visualizar sus ubicaciones de rastreo y revisar todos los estados generados"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {selectedDevice && (
                <div className="w-80 border-l border-white/20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl">
                    <div className="p-6 border-b border-white/20 bg-gradient-to-r from-slate-50/80 to-blue-50/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                                <Activity className="h-5 w-5 text-white" />
                            </div>
                            Panel de Control
                        </h3>
                    </div>

                    <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-100px)]">
                        {/*  <Card className="border-white/30 shadow-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Activity className="h-4 w-4 text-emerald-600" />
                                    Lecturas en Tiempo Real
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    {Object.entries(selectedDevice.data).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-700/80 dark:to-slate-600/80 rounded-lg shadow-sm backdrop-blur-sm"
                                        >
                                            <span className="text-slate-600 dark:text-slate-400 capitalize font-semibold">{key}:</span>
                                            <span className="font-bold text-lg text-slate-800 dark:text-slate-100">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>*/}

                        <Card className="border-white/30 shadow-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    Historial de Estados
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {selectedDevice.locations.map((location, index) => (
                                        <div
                                            key={index}
                                            className={`text-sm p-4 rounded-xl border transition-all cursor-pointer shadow-sm backdrop-blur-sm ${selectedLocation === index
                                                ? "bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border-blue-300 dark:from-blue-900/30 dark:to-indigo-900/30 dark:border-blue-600 shadow-lg"
                                                : "bg-gradient-to-r from-slate-50/80 to-white/80 border-slate-200 hover:from-slate-100/80 hover:to-slate-50/80 dark:from-slate-700/80 dark:to-slate-600/80 dark:border-slate-600 dark:hover:from-slate-600/80 dark:hover:to-slate-500/80"
                                                }`}
                                            onClick={() => setSelectedLocation(selectedLocation === index ? null : index)}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge
                                                    variant={
                                                        location.status.includes("validado") || location.status.includes("aprobado")
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className="text-xs font-semibold"
                                                >
                                                    {location.status}
                                                </Badge>
                                                <span className="text-slate-500 dark:text-slate-400 font-medium">{location.timestamp}</span>
                                            </div>
                                            <div className="text-slate-600 dark:text-slate-400 font-mono text-xs bg-slate-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                                                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}