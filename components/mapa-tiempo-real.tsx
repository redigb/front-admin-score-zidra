"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Battery, Wifi, WifiOff, Eye, Navigation } from "lucide-react"

interface DispositivoMapa {
  id: string
  alias: string
  lat: number
  lng: number
  estado: "online" | "offline"
  bateria: number
  cuotaVigente: number
  estadoCobro: "pagado" | "pendiente" | "atrasado"
  proximaCuota: string
}

const dispositivosMapaData: DispositivoMapa[] = [
  {
    id: "GPS001",
    alias: "Refrigerador Samsung",
    lat: 4.6097,
    lng: -74.0817,
    estado: "online",
    bateria: 85,
    cuotaVigente: 150000,
    estadoCobro: "pagado",
    proximaCuota: "2024-02-15",
  },
  {
    id: "GPS002",
    alias: "Motocicleta Yamaha",
    lat: 4.6351,
    lng: -74.0703,
    estado: "online",
    bateria: 92,
    cuotaVigente: 200000,
    estadoCobro: "pendiente",
    proximaCuota: "2024-01-30",
  },
  {
    id: "GPS003",
    alias: "Automóvil Toyota",
    lat: 4.5981,
    lng: -74.0758,
    estado: "offline",
    bateria: 23,
    cuotaVigente: 300000,
    estadoCobro: "atrasado",
    proximaCuota: "2024-01-15",
  },
  {
    id: "GPS004",
    alias: "Lavadora LG",
    lat: 4.6482,
    lng: -74.0906,
    estado: "online",
    bateria: 67,
    cuotaVigente: 180000,
    estadoCobro: "pagado",
    proximaCuota: "2024-02-20",
  },
]

export function MapaTiempoReal() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDevice, setSelectedDevice] = useState<DispositivoMapa | null>(null)

  const filteredDevices = dispositivosMapaData.filter(
    (device) =>
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.alias.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getEstadoCobroBadge = (estado: string) => {
    switch (estado) {
      case "pagado":
        return "bg-green-500"
      case "pendiente":
        return "bg-yellow-500"
      case "atrasado":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-600"
    if (level > 20) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mapa en Tiempo Real</h1>
          <p className="text-gray-600 mt-1">Ubicación y estado de dispositivos IoT</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar dispositivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa Principal */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                Mapa Interactivo
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
                {/* Simulación de mapa */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200">
                  <div className="absolute inset-4 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30">
                    <div className="p-4 text-center text-gray-600">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                      <p className="font-medium">Mapa Interactivo GPS</p>
                      <p className="text-sm">Clusters de dispositivos en tiempo real</p>
                    </div>
                  </div>
                </div>

                {/* Puntos de dispositivos simulados */}
                {filteredDevices.map((device, index) => (
                  <div
                    key={device.id}
                    className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-125 transition-transform ${getEstadoCobroBadge(device.estadoCobro)}`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`,
                    }}
                    onClick={() => setSelectedDevice(device)}
                  >
                    {device.estado === "offline" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse" />
                    )}
                  </div>
                ))}

                {/* Leyenda del mapa */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <h4 className="font-semibold text-sm mb-2">Estado de Pagos</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Al día</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Pendiente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Vencida</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral con detalles */}
        <div className="space-y-4">
          {/* Dispositivo seleccionado */}
          {selectedDevice && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalle del Dispositivo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900">{selectedDevice.alias}</p>
                  <p className="text-sm text-gray-600 font-mono">{selectedDevice.id}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <div className="flex items-center gap-2">
                    {selectedDevice.estado === "online" ? (
                      <>
                        <Wifi className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-4 h-4 text-red-600" />
                        <span className="text-red-600 font-medium">Offline</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Batería:</span>
                  <div className="flex items-center gap-2">
                    <Battery className={`w-4 h-4 ${getBatteryColor(selectedDevice.bateria)}`} />
                    <span className={`font-medium ${getBatteryColor(selectedDevice.bateria)}`}>
                      {selectedDevice.bateria}%
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Próxima cuota:</span>
                    <span className="font-semibold">${selectedDevice.cuotaVigente.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estado de pago:</span>
                    <Badge
                      className={
                        selectedDevice.estadoCobro === "pagado"
                          ? "bg-green-100 text-green-800"
                          : selectedDevice.estadoCobro === "pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedDevice.estadoCobro === "pagado"
                        ? "✅ Al día"
                        : selectedDevice.estadoCobro === "pendiente"
                          ? "⚠️ Pendiente"
                          : "❌ Vencida"}
                    </Badge>
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver detalle completo
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Lista de dispositivos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dispositivos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {filteredDevices.map((device) => (
                  <div
                    key={device.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedDevice?.id === device.id ? "bg-blue-50 border-blue-200" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{device.alias}</span>
                      <div className="flex items-center gap-1">
                        {device.estado === "online" ? (
                          <Wifi className="w-3 h-3 text-green-600" />
                        ) : (
                          <WifiOff className="w-3 h-3 text-red-600" />
                        )}
                        <div className={`w-2 h-2 rounded-full ${getEstadoCobroBadge(device.estadoCobro)}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{device.id}</span>
                      <span className={getBatteryColor(device.bateria)}>{device.bateria}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
