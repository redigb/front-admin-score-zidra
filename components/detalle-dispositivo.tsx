"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  Battery,
  MapPin,
  RedoDot as Reboot,
  Settings,
  Clock,
  HardDrive,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  CreditCard,
} from "lucide-react"

interface EventoTimeline {
  id: string
  tipo: "conexion" | "desconexion" | "geocerca" | "alerta"
  descripcion: string
  timestamp: string
  estado: "success" | "warning" | "error"
}

interface PagoHistorial {
  id: string
  fecha: string
  monto: number
  estado: "pagado" | "pendiente" | "vencido"
  metodoPago: string
}

const eventosData: EventoTimeline[] = [
  {
    id: "1",
    tipo: "conexion",
    descripcion: "Dispositivo conectado exitosamente",
    timestamp: "2024-01-28 14:30:25",
    estado: "success",
  },
  {
    id: "2",
    tipo: "geocerca",
    descripcion: "Entrada a geocerca: Zona Residencial Norte",
    timestamp: "2024-01-28 14:15:10",
    estado: "success",
  },
  {
    id: "3",
    tipo: "alerta",
    descripcion: "Batería baja detectada (25%)",
    timestamp: "2024-01-28 13:45:00",
    estado: "warning",
  },
  {
    id: "4",
    tipo: "desconexion",
    descripcion: "Pérdida de conexión por 15 minutos",
    timestamp: "2024-01-28 12:30:15",
    estado: "error",
  },
]

const pagosData: PagoHistorial[] = [
  {
    id: "1",
    fecha: "2024-01-15",
    monto: 150000,
    estado: "pagado",
    metodoPago: "Transferencia bancaria",
  },
  {
    id: "2",
    fecha: "2023-12-15",
    monto: 150000,
    estado: "pagado",
    metodoPago: "Efectivo",
  },
  {
    id: "3",
    fecha: "2023-11-15",
    monto: 150000,
    estado: "pagado",
    metodoPago: "Tarjeta de crédito",
  },
]

export function DetalleDispositivo() {
  const [activeTab, setActiveTab] = useState("operativo")

  // Datos del dispositivo seleccionado (simulado)
  const dispositivo = {
    id: "GPS001",
    alias: "Refrigerador Samsung - Casa López",
    estado: "online",
    bateria: 85,
    ultimaConexion: "Hace 2 min",
    firmware: "v2.1.4",
    geocerca: "Zona Residencial Norte",
    ubicacion: "Calle 123 #45-67, Bogotá",
    cuotaVigente: 150000,
    estadoCobro: "pagado",
    proximaFactura: "2024-02-15",
    planActual: "Mensual",
    clienteNombre: "María López",
    clienteTelefono: "+57 300 123 4567",
  }

  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case "conexion":
        return <Wifi className="w-4 h-4 text-green-600" />
      case "desconexion":
        return <WifiOff className="w-4 h-4 text-red-600" />
      case "geocerca":
        return <MapPin className="w-4 h-4 text-blue-600" />
      case "alerta":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getEventColor = (estado: string) => {
    switch (estado) {
      case "success":
        return "border-green-200 bg-green-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "error":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver a dispositivos
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{dispositivo.alias}</h1>
            <p className="text-gray-600 mt-1">
              ID: {dispositivo.id} • {dispositivo.ubicacion}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={dispositivo.estado === "online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          >
            {dispositivo.estado === "online" ? "🟢 Online" : "🔴 Offline"}
          </Badge>
        </div>
      </div>

      {/* Información rápida */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Batería</p>
                <p className="text-2xl font-bold text-green-600">{dispositivo.bateria}%</p>
              </div>
              <Battery className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Última conexión</p>
                <p className="text-lg font-semibold text-gray-900">{dispositivo.ultimaConexion}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Firmware</p>
                <p className="text-lg font-semibold text-gray-900">{dispositivo.firmware}</p>
              </div>
              <Settings className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estado de pago</p>
                <Badge className="bg-green-100 text-green-800">✅ Al día</Badge>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="operativo">Operativo</TabsTrigger>
          <TabsTrigger value="financiero">Financiero</TabsTrigger>
        </TabsList>

        <TabsContent value="operativo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline de eventos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Timeline de Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {eventosData.map((evento) => (
                    <div key={evento.id} className={`p-3 rounded-lg border ${getEventColor(evento.estado)}`}>
                      <div className="flex items-start gap-3">
                        {getEventIcon(evento.tipo)}
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{evento.descripcion}</p>
                          <p className="text-xs text-gray-600 mt-1">{evento.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Memoria SD y acciones */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-purple-600" />
                    Memoria SD
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Archivos pendientes:</span>
                    <Badge variant="secondary">12 archivos</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Archivos subidos:</span>
                    <Badge className="bg-green-100 text-green-800">1,247 archivos</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Upload className="w-4 h-4 mr-2" />
                      Sincronizar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones Remotas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Reboot className="w-4 h-4 mr-2" />
                    Reiniciar dispositivo
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Cambiar intervalo de reporte
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Asignar geocerca
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="financiero" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumen financiero */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Resumen Financiero
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-900">Plan actual:</span>
                  <Badge className="bg-green-100 text-green-800">{dispositivo.planActual}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cuota vigente:</span>
                  <span className="font-bold text-xl">${dispositivo.cuotaVigente.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Próxima factura:</span>
                  <span className="font-medium">{dispositivo.proximaFactura}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-900">Estado:</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />✅ Al día
                  </Badge>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Información del cliente</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre:</span>
                      <span>{dispositivo.clienteNombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Teléfono:</span>
                      <span>{dispositivo.clienteTelefono}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historial de pagos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Historial de Pagos (Últimos 3)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pagosData.map((pago) => (
                    <div key={pago.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">${pago.monto.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{pago.fecha}</p>
                        <p className="text-xs text-gray-500">{pago.metodoPago}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Pagado
                      </Badge>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Ver historial completo
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
