"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, User, Clock, Download, Search, Filter } from "lucide-react"

export function Auditoria() {
  const auditLogs = [
    {
      id: "AUD-001",
      action: "Modelo Actualizado",
      user: "admin@empresa.com",
      details: "Random Forest v2.1.3 desplegado en producción",
      timestamp: "2024-01-15 10:30:00",
      category: "model",
    },
    {
      id: "AUD-002",
      action: "Decisión Crediticia",
      user: "analista1@empresa.com",
      details: "Caso CASE-001 aprobado manualmente",
      timestamp: "2024-01-15 10:25:00",
      category: "decision",
    },
    {
      id: "AUD-003",
      action: "Configuración Modificada",
      user: "admin@empresa.com",
      details: "Umbral de riesgo cambiado de 0.7 a 0.65",
      timestamp: "2024-01-15 09:15:00",
      category: "config",
    },
    {
      id: "AUD-004",
      action: "Acceso al Sistema",
      user: "supervisor@empresa.com",
      details: "Login exitoso desde IP 192.168.1.100",
      timestamp: "2024-01-15 08:45:00",
      category: "access",
    },
  ]

  const complianceMetrics = [
    { metric: "Decisiones Auditadas", value: "1,247", percentage: 100, status: "compliant" },
    { metric: "Documentos Respaldados", value: "1,189", percentage: 95.3, status: "compliant" },
    { metric: "Casos con Justificación", value: "1,201", percentage: 96.3, status: "compliant" },
    { metric: "Reportes Generados", value: "45", percentage: 100, status: "compliant" },
  ]

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "model":
        return <Badge className="bg-purple-100 text-purple-800">Modelo</Badge>
      case "decision":
        return <Badge className="bg-green-100 text-green-800">Decisión</Badge>
      case "config":
        return <Badge className="bg-blue-100 text-blue-800">Configuración</Badge>
      case "access":
        return <Badge className="bg-gray-100 text-gray-800">Acceso</Badge>
      default:
        return <Badge>Otro</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auditoría</h1>
          <p className="text-gray-600 mt-1">Registro completo de actividades y cumplimiento normativo</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceMetrics.map((metric) => (
          <Card key={metric.metric} className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-indigo-600" />
                <Badge className="bg-green-100 text-green-800">{metric.percentage}%</Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{metric.metric}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${metric.percentage}%` }}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Audit Logs */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Registro de Auditoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-gray-900">{log.action}</p>
                      {getCategoryBadge(log.category)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{log.details}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {log.user}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {log.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
