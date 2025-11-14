"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Eye, Shield, Target } from "lucide-react"

export function ValidacionPrescore() {

    const validationRules = [
        { rule: "Verificación de Identidad", passed: 156, failed: 12, accuracy: 92.8 },
        { rule: "Validación de Ingresos", passed: 134, failed: 34, accuracy: 79.8 },
        { rule: "Referencias Comerciales", passed: 145, failed: 23, accuracy: 86.3 },
        { rule: "Historial Crediticio", passed: 128, failed: 40, accuracy: 76.2 },
    ]

    const prescoreResults = [
        { id: "CASE-001", client: "Juan Pérez", prescore: 85, risk: "Bajo", recommendation: "Aprobar", validations: 4 },
        { id: "CASE-002", client: "María García", prescore: 72, risk: "Medio", recommendation: "Revisar", validations: 3 },
        { id: "CASE-003", client: "Carlos López", prescore: 45, risk: "Alto", recommendation: "Rechazar", validations: 2 },
        { id: "CASE-004", client: "Ana Martín", prescore: 68, risk: "Medio", recommendation: "Revisar", validations: 3 },
    ]

    const getRiskBadge = (risk: string) => {
        switch (risk) {
            case "Bajo":
                return <Badge className="bg-green-100 text-green-800">Bajo</Badge>
            case "Medio":
                return <Badge className="bg-yellow-100 text-yellow-800">Medio</Badge>
            case "Alto":
                return <Badge className="bg-red-100 text-red-800">Alto</Badge>
            default:
                return <Badge>Desconocido</Badge>
        }
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Validación & Pre-score</h1>
                    <p className="text-gray-600 mt-1">Validación automática de datos y cálculo de pre-score crediticio</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Configurar Reglas
                </Button>
            </div>

            {/* Validation Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {validationRules.map((rule) => (
                    <Card key={rule.rule} className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Shield className="w-8 h-8 text-indigo-600" />
                                <span className="text-sm font-medium text-gray-600">{rule.accuracy}%</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm">{rule.rule}</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                                        <span className="text-gray-600">Pasaron:</span>
                                    </div>
                                    <span className="font-medium text-green-600">{rule.passed}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <XCircle className="w-4 h-4 text-red-600 mr-1" />
                                        <span className="text-gray-600">Fallaron:</span>
                                    </div>
                                    <span className="font-medium text-red-600">{rule.failed}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pre-score Results */}
            <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Resultados de Pre-score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {prescoreResults.map((result) => (
                            <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Target className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {result.id} - {result.client}
                                        </p>
                                        <p className="text-sm text-gray-600">Validaciones: {result.validations}/4</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">{result.prescore}</p>
                                        <p className="text-xs text-gray-500">{result.recommendation}</p>
                                    </div>
                                    {getRiskBadge(result.risk)}
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
