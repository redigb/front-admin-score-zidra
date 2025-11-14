"use client";

import { useState } from "react";
import { Dispositivo } from "@/interface/dispositivos";
import { useDispositivos } from "@/hooks/use-fetch-dipositivos";
import {
  Wifi,
  WifiOff,
  Search,
  Eye,
  MoreHorizontal,
  SignalMedium,
  Smartphone,
  Calendar,
  Cpu,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DispositivosTabla() {
  const { data: dispositivosData = [] } = useDispositivos();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);

  const filteredDevices = dispositivosData.filter(
    (device: Dispositivo) =>
      device.id.toString().includes(searchTerm.toLowerCase()) ||
      device.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.deviceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.imei.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-blue-100 z-10 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">📡 Dispositivos IoT</h1>
          <p className="text-sm text-blue-600">
            Gestión de dispositivos GPS y su estado de conexión
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
          <Input
            placeholder="Buscar por ID, IMEI o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Lista de dispositivos */}
      <div className="space-y-4">
        {filteredDevices.map((device) => (
          <Card
            key={device.id}
            className="border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all rounded-xl"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Info principal */}
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                    #{device.id}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {device.modelo}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      {device.status === "ONLINE" ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <Wifi className="w-4 h-4" /> Online
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <WifiOff className="w-4 h-4" /> Offline
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                        FW {device.versionFirmware}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-blue-50 text-blue-600"
                    onClick={() =>
                      setSelectedDevice(
                        selectedDevice === device.id ? null : device.id
                      )
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-50 text-gray-500"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Detalles expandibles */}
              {selectedDevice === device.id && (
                <div className="mt-4 pt-4 border-t border-blue-100 bg-blue-50 rounded-lg p-3 text-sm grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Code:</span>{" "}
                    {device.deviceCode}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Smartphone className="w-4 h-4 text-green-600" />
                    <span className="font-medium">IMEI:</span> {device.imei}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <SignalMedium className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">SIM:</span>{" "}
                    {device.simNumeroTelefono} ({device.simOperador})
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Creado:</span>{" "}
                    {new Date(device.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">Plan:</span> {device.simPlan}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">MQTT:</span>{" "}
                    {device.mqttUsername ? (
                      <span className="text-green-600">
                        {device.mqttUsername}
                      </span>
                    ) : (
                      <span className="text-red-500">No configurado</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredDevices.length === 0 && (
          <p className="text-center text-blue-600">
            ⚠️ No se encontraron dispositivos
          </p>
        )}
      </div>
    </div>
  );
}
