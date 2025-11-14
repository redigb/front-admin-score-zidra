"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Wifi, WifiOff, Battery, Eye, AlertTriangle, MoreHorizontal } from "lucide-react"

interface Dispositivo {
    id: string
    alias: string
    estado: "online" | "offline"
    bateria: number
    ultimaConexion: string
    firmware: string
    geocerca: string
    cuotaVigente: number
    estadoCobro: "pagado" | "pendiente" | "atrasado"
    fechaVencimiento: string
}

const dispositivosData: Dispositivo[] = [
    {
        id: "GPS001",
        alias: "Refrigerador Samsung - Casa López",
        estado: "online",
        bateria: 85,
        ultimaConexion: "Hace 2 min",
        firmware: "v2.1.4",
        geocerca: "Zona Residencial Norte",
        cuotaVigente: 150000,
        estadoCobro: "pagado",
        fechaVencimiento: "2024-02-15",
    },
    {
        id: "GPS002",
        alias: "Motocicleta Yamaha - Delivery Express",
        estado: "online",
        bateria: 92,
        ultimaConexion: "Hace 1 min",
        firmware: "v2.1.4",
        geocerca: "Ruta Comercial Centro",
        cuotaVigente: 200000,
        estadoCobro: "pendiente",
        fechaVencimiento: "2024-01-30",
    },
    {
        id: "GPS003",
        alias: "Automóvil Toyota - Taxi Urbano",
        estado: "offline",
        bateria: 23,
        ultimaConexion: "Hace 45 min",
        firmware: "v2.0.8",
        geocerca: "Sin asignar",
        cuotaVigente: 300000,
        estadoCobro: "atrasado",
        fechaVencimiento: "2024-01-15",
    },
    {
        id: "GPS004",
        alias: "Lavadora LG - Lavandería Central",
        estado: "online",
        bateria: 67,
        ultimaConexion: "Hace 5 min",
        firmware: "v2.1.2",
        geocerca: "Zona Industrial",
        cuotaVigente: 180000,
        estadoCobro: "pagado",
        fechaVencimiento: "2024-02-20",
    },
]

export function DispositivosTabla() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

    const filteredDevices = dispositivosData.filter(
        (device) =>
            device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.alias.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const getEstadoCobroBadge = (estado: string) => {
        switch (estado) {
            case "pagado":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">✅ Al día</Badge>
            case "pendiente":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⚠️ Pendiente</Badge>
            case "atrasado":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">❌ Vencida</Badge>
            default:
                return <Badge variant="secondary">Desconocido</Badge>
        }
    }

    const getBatteryColor = (level: number) => {
        if (level > 50) return "text-green-600"
        if (level > 20) return "text-yellow-600"
        return "text-red-600"
    }

    return (
        <div className="p-6 space-y-6 bg-white min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Dispositivos IoT</h1>
                    <p className="text-gray-600 mt-1">Gestión de unidades GPS y estado operativo</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar dispositivo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {filteredDevices.map((device) => (
                    <Card key={device.id} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        <span className="font-mono text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                            {device.id}
                                        </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-medium text-gray-900 truncate">{device.alias}</h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                {device.estado === "online" ? (
                                                    <>
                                                        <Wifi className="w-4 h-4 text-green-500" />
                                                        <span className="text-green-600">Online</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <WifiOff className="w-4 h-4 text-red-500" />
                                                        <span className="text-red-600">Offline</span>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Battery className={`w-4 h-4 ${getBatteryColor(device.bateria)}`} />
                                                <span className={getBatteryColor(device.bateria)}>{device.bateria}%</span>
                                            </div>

                                            <span>{device.ultimaConexion}</span>

                                            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{device.firmware}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Cuota</p>
                                        <p className="font-semibold text-gray-900">${device.cuotaVigente.toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {getEstadoCobroBadge(device.estadoCobro)}
                                        {device.estadoCobro === "atrasado" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-8 h-8 p-0 hover:bg-blue-50 text-blue-600"
                                            onClick={() => setSelectedDevice(device.id)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-gray-100 text-gray-600">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {selectedDevice === device.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Geocerca:</span>
                                            <span className="ml-2 text-gray-900">{device.geocerca}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Vencimiento:</span>
                                            <span className="ml-2 text-gray-900">{device.fechaVencimiento}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <Card className="border border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Online</p>
                                <p className="text-xl font-semibold text-green-600">
                                    {dispositivosData.filter((d) => d.estado === "online").length}
                                </p>
                            </div>
                            <Wifi className="w-5 h-5 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Offline</p>
                                <p className="text-xl font-semibold text-red-600">
                                    {dispositivosData.filter((d) => d.estado === "offline").length}
                                </p>
                            </div>
                            <WifiOff className="w-5 h-5 text-red-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Al día</p>
                                <p className="text-xl font-semibold text-blue-600">
                                    {dispositivosData.filter((d) => d.estadoCobro === "pagado").length}
                                </p>
                            </div>
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Vencidas</p>
                                <p className="text-xl font-semibold text-red-600">
                                    {dispositivosData.filter((d) => d.estadoCobro === "atrasado").length}
                                </p>
                            </div>
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
