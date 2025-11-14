"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Database } from "lucide-react"

export function IngestaClasificacion() {
  const documentTypes = [
    { type: "Cédula", count: 45, processed: 42, pending: 3, status: "active" },
    { type: "Comprobante Ingresos", count: 38, processed: 35, pending: 3, status: "active" },
    { type: "Referencias Comerciales", count: 29, processed: 28, pending: 1, status: "active" },
    { type: "Estados Financieros", count: 22, processed: 20, pending: 2, status: "processing" },
  ]

  const recentUploads = [
    { id: "DOC-001", client: "Juan Pérez", type: "Cédula", status: "processed", confidence: 98, timestamp: "10:30 AM" },
    {
      id: "DOC-002",
      client: "María García",
      type: "Comprobante",
      status: "processing",
      confidence: 85,
      timestamp: "10:25 AM",
    },
    {
      id: "DOC-003",
      client: "Carlos López",
      type: "Referencias",
      status: "failed",
      confidence: 45,
      timestamp: "10:20 AM",
    },
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ingesta & Clasificación</h1>
          <p className="text-gray-600 mt-1">Procesamiento automático de documentos y clasificación inteligente</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Upload className="w-4 h-4 mr-2" />
          Cargar Documentos
        </Button>
      </div>

      {/* Document Types Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {documentTypes.map((doc) => (
          <Card key={doc.type} className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-indigo-600" />
                <Badge variant={doc.status === "active" ? "default" : "secondary"}>
                  {doc.status === "active" ? "Activo" : "Procesando"}
                </Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{doc.type}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">{doc.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Procesados:</span>
                  <span className="text-green-600 font-medium">{doc.processed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pendientes:</span>
                  <span className="text-yellow-600 font-medium">{doc.pending}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Uploads */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Documentos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {upload.id} - {upload.client}
                    </p>
                    <p className="text-sm text-gray-600">{upload.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Confianza: {upload.confidence}%</p>
                    <p className="text-xs text-gray-500">{upload.timestamp}</p>
                  </div>
                  <Badge
                    variant={
                      upload.status === "processed"
                        ? "default"
                        : upload.status === "processing"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {upload.status === "processed"
                      ? "Procesado"
                      : upload.status === "processing"
                        ? "Procesando"
                        : "Error"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
