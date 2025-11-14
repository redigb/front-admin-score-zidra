"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, TrendingDown, TrendingUp, Monitor, RefreshCw } from "lucide-react"

export function RiesgoModelOps() {
  const riskMetrics = [
    { metric: "Drift de Datos", value: "2.3%", status: "normal", trend: "down" },
    { metric: "Precisión del Modelo", value: "94.2%", status: "good", trend: "up" },
    { metric: "Latencia Promedio", value: "120ms", status: "normal", trend: "stable" },
    { metric: "Tasa de Error", value: "0.8%", status: "good", trend: "down" },
  ]

  const modelVersions = [
    { version: "v2.1.3", status: "production", accuracy: 94.2, deployed: "2024-01-10", traffic: 100 },
    { version: "v2.1.2", status: "canary", accuracy: 93.8, deployed: "2024-01-08", traffic: 10 },
    { version: "v2.0.9", status: "staging", accuracy: 92.5, deployed: "2024-01-05", traffic: 0 },
  ]

  const alerts = [
    { id: "ALT-001", type: "warning", message: "Drift detectado en variable 'ingresos'", timestamp: "10:30 AM" },
    { id: "ALT-002", type: "info", message: "Nuevo modelo v2.1.3 desplegado", timestamp: "09:15 AM" },
    { id: "ALT-003", type: "error", message: "Fallo en validación de datos", timestamp: "08:45 AM" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "production":
        return <Badge className="bg-green-100 text-green-800">Producción</Badge>
      case "canary":
        return <Badge className="bg-yellow-100 text-yellow-800">Canary</Badge>
      case "staging":
        return <Badge className="bg-blue-100 text-blue-800">Staging</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Riesgo & ModelOps</h1>
          <p className="text-gray-600 mt-1">Monitoreo de modelos en producción y gestión de riesgos operacionales</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar Modelos
        </Button>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {riskMetrics.map((metric) => (
          <Card key={metric.metric} className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Monitor className="w-8 h-8 text-indigo-600" />
                {metric.trend === "up" && <TrendingUp className="w-5 h-5 text-green-600" />}
                {metric.trend === "down" && <TrendingDown className="w-5 h-5 text-red-600" />}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{metric.metric}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <Badge
                variant={
                  metric.status === "good" ? "default" : metric.status === "normal" ? "secondary" : "destructive"
                }
                className="mt-2"
              >
                {metric.status === "good" ? "Bueno" : metric.status === "normal" ? "Normal" : "Crítico"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Versions */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Versiones del Modelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelVersions.map((version) => (
                <div key={version.version} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{version.version}</p>
                    <p className="text-sm text-gray-600">Precisión: {version.accuracy}%</p>
                    <p className="text-xs text-gray-500">Desplegado: {version.deployed}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Tráfico: {version.traffic}%</p>
                    {getStatusBadge(version.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alertas del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div
                    className={`p-1 rounded-full ${
                      alert.type === "error" ? "bg-red-100" : alert.type === "warning" ? "bg-yellow-100" : "bg-blue-100"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        alert.type === "error"
                          ? "text-red-600"
                          : alert.type === "warning"
                            ? "text-yellow-600"
                            : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
