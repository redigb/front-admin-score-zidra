"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle, AlertTriangle, Clock, TrendingUp } from "lucide-react"
import { IngestaClasificacion } from "./ingesta-clasificacion"
import { ValidacionPrescore } from "./validacion-prescore"
import { EvaluacionML } from "./evaluacion-ml"
import { RiesgoModelOps } from "./riesgo-modelops"
import { Auditoria } from "./auditoria"

interface EvaluacionDashboardProps {
  activeSection?: string
}

export function EvaluacionDashboard({ activeSection = "dashboard" }: EvaluacionDashboardProps) {
  if (activeSection === "ingesta") return <IngestaClasificacion />
  if (activeSection === "validacion") return <ValidacionPrescore />
  if (activeSection === "ml") return <EvaluacionML />
  if (activeSection === "riesgo") return <RiesgoModelOps />
  if (activeSection === "auditoria") return <Auditoria />

  const stats = [
    {
      title: "Casos Totales",
      value: "1,247",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Aprobados",
      value: "892",
      change: "+8%",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "En Revisión",
      value: "234",
      change: "+15%",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Rechazados",
      value: "121",
      change: "-5%",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ]

  const recentCases = [
    { id: "CASE-001", client: "Juan Pérez", status: "approved", score: 85, date: "2024-01-15" },
    { id: "CASE-002", client: "María García", status: "pending", score: 72, date: "2024-01-15" },
    { id: "CASE-003", client: "Carlos López", status: "rejected", score: 45, date: "2024-01-14" },
    { id: "CASE-004", client: "Ana Martín", status: "review", score: 68, date: "2024-01-14" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
      case "review":
        return <Badge className="bg-blue-100 text-blue-800">En Revisión</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Evaluación</h1>
          <p className="text-gray-600 mt-1">Resumen general del sistema de evaluación de crédito</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <FileText className="w-4 h-4 mr-2" />
          Nuevo Caso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Casos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCases.map((case_) => (
              <div key={case_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-gray-900">{case_.id}</p>
                    <p className="text-sm text-gray-600">{case_.client}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Score: {case_.score}</p>
                    <p className="text-xs text-gray-500">{case_.date}</p>
                  </div>
                  {getStatusBadge(case_.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
