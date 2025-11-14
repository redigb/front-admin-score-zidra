"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Activity, BarChart3, Settings } from "lucide-react"

export function EvaluacionML() {
  const modelMetrics = [
    { model: "Random Forest", accuracy: 94.2, precision: 91.8, recall: 89.5, f1Score: 90.6 },
    { model: "XGBoost", accuracy: 92.8, precision: 90.3, recall: 88.1, f1Score: 89.2 },
    { model: "Neural Network", accuracy: 91.5, precision: 89.7, recall: 87.3, f1Score: 88.5 },
    { model: "Logistic Regression", accuracy: 87.3, precision: 85.2, recall: 83.8, f1Score: 84.5 },
  ]

  const recentPredictions = [
    {
      id: "PRED-001",
      client: "Juan Pérez",
      model: "Random Forest",
      score: 0.85,
      probability: 85.2,
      decision: "Aprobar",
    },
    { id: "PRED-002", client: "María García", model: "XGBoost", score: 0.72, probability: 72.8, decision: "Revisar" },
    {
      id: "PRED-003",
      client: "Carlos López",
      model: "Random Forest",
      score: 0.45,
      probability: 45.3,
      decision: "Rechazar",
    },
    {
      id: "PRED-004",
      client: "Ana Martín",
      model: "Neural Network",
      score: 0.68,
      probability: 68.7,
      decision: "Revisar",
    },
  ]

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case "Aprobar":
        return <Badge className="bg-green-100 text-green-800">Aprobar</Badge>
      case "Revisar":
        return <Badge className="bg-yellow-100 text-yellow-800">Revisar</Badge>
      case "Rechazar":
        return <Badge className="bg-red-100 text-red-800">Rechazar</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Evaluación ML</h1>
          <p className="text-gray-600 mt-1">Modelos de machine learning para evaluación crediticia automatizada</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Settings className="w-4 h-4 mr-2" />
          Entrenar Modelo
        </Button>
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modelMetrics.map((model) => (
          <Card key={model.model} className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Brain className="w-8 h-8 text-indigo-600" />
                <Badge variant="secondary">{model.accuracy}%</Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">{model.model}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Precisión:</span>
                  <span className="font-medium">{model.precision}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recall:</span>
                  <span className="font-medium">{model.recall}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">F1-Score:</span>
                  <span className="font-medium">{model.f1Score}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Predictions */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Predicciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPredictions.map((pred) => (
              <div key={pred.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Brain className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {pred.id} - {pred.client}
                    </p>
                    <p className="text-sm text-gray-600">Modelo: {pred.model}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{pred.probability}%</p>
                    <p className="text-xs text-gray-500">Score: {pred.score}</p>
                  </div>
                  {getDecisionBadge(pred.decision)}
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4" />
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
