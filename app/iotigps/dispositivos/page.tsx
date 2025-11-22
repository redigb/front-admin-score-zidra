"use client";

import { useState, useMemo, useEffect } from "react";
import { Dispositivo, DispositivoCreate } from "@/interface/dispositivos";
import { useDispositivos, useDispositivoById } from "@/hooks/use-fetch-dipositivos";
import { dispositivosService } from "@/service/service-dispositivos";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  Search,
  Smartphone,
  Cpu,
  Signal,
  Globe,
  Battery,
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Server,
  CreditCard,
  Plus,
  Loader2,
  Save,
  MoreVertical,
  Pencil,
  Trash2,
  AlertTriangle,
  Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


const ActivitySparkline = ({ active }: { active: boolean }) => (
  <div className="h-20 w-full overflow-hidden opacity-25 pointer-events-none absolute bottom-10 left-0 right-0 z-0">
    <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
      <path
        d="M0 10 Q 10 15, 20 10 T 40 10 T 60 15 T 80 5 T 100 12"
        fill="none"
        stroke={active ? "#2563eb" : "#94a3b8"}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 10 Q 10 15, 20 10 T 40 10 T 60 15 T 80 5 T 100 12 V 20 H 0 Z"
        fill={active ? "url(#gradient-active)" : "url(#gradient-inactive)"}
        className="opacity-30"
      />
      <defs>
        <linearGradient id="gradient-active" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradient-inactive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// Estado inicial del formulario
const initialFormState: DispositivoCreate = {
  modelo: "",
  deviceCode: "",
  imei: "",
  versionFirmware: "1.0.0",
  status: "OFFLINE",
  simNumeroTelefono: "",
  simOperador: "",
  simPlan: "Prepago",
};

export default function IoTDashboard() {
  const { data: rawData, isLoading, refetch } = useDispositivos();
  const dispositivosData = useMemo(() => Array.isArray(rawData) ? rawData : [], [rawData]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ONLINE" | "OFFLINE">("ALL");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Estados de Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Datos del formulario
  const [formData, setFormData] = useState<DispositivoCreate>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // Hook para editar (obtiene data por ID)
  const { data: deviceToEdit, isLoading: isLoadingEdit } = useDispositivoById(editingId || 0);
  // EFECTO: Rellenar formulario al editar
  useEffect(() => {
    if (editingId && deviceToEdit) {
      setFormData({
        modelo: deviceToEdit.modelo,
        deviceCode: deviceToEdit.deviceCode,
        imei: deviceToEdit.imei,
        versionFirmware: deviceToEdit.versionFirmware,
        status: deviceToEdit.status,
        simNumeroTelefono: deviceToEdit.simNumeroTelefono,
        simOperador: deviceToEdit.simOperador,
        simPlan: deviceToEdit.simPlan,
      });
      setIsModalOpen(true);
    }
  }, [deviceToEdit, editingId]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: number) => setEditingId(id);

  const handleOpenDelete = (id: number) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Eliminando dispositivo...");
    try {
      await dispositivosService.delete(idToDelete);
      toast.success("Dispositivo eliminado", { id: toastId });
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
      if (refetch) refetch();
    } catch (error) {
      toast.error("Error al eliminar", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await dispositivosService.update(editingId, formData);
        toast.success("Dispositivo actualizado");
      } else {
        await dispositivosService.create(formData);
        toast.success("Dispositivo registrado");
      }

      setIsModalOpen(false);
      setEditingId(null);

      if (refetch) refetch();

    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Error al guardar cambios";

      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lógica de Filtrado
  const filteredDevices = dispositivosData.filter((d) => {
    const matchesSearch =
      d.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.imei?.includes(searchTerm) ||
      d.id.toString().includes(searchTerm);
    const matchesFilter = filter === "ALL" ? true : filter === "ONLINE" ? d.status === "ONLINE" : d.status !== "ONLINE";
    return matchesSearch && matchesFilter;
  });

  const toggleExpand = (id: number) => setExpandedId(expandedId === id ? null : id);
  const onlineCount = dispositivosData.filter(d => d.status === "ONLINE").length;
  const offlineCount = dispositivosData.length - onlineCount;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">

        {/* --- Header --- */}
        <header className="w-full border-b border-blue-100 bg-white/80 backdrop-blur-xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                Dispositivos <span className="text-blue-600">IoT-GPS</span>
              </h1>
              <div className="flex items-center gap-2 mt-1 text-xs font-medium">
                <span className="text-slate-500">Estado Global:</span>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">{onlineCount} Online</span>
                <span className="text-slate-400 px-1">•</span>
                <span className="text-slate-500">{offlineCount} Offline</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center gap-3 w-full md:w-auto">
            {/* Filtros */}
            <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200 w-full md:w-auto justify-center">
              {["ALL", "ONLINE", "OFFLINE"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${filter === f
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
                    }`}
                >
                  {f === "ALL" ? "Todos" : f}
                </button>
              ))}
            </div>

            {/* Buscador */}
            <div className="relative group w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Buscar dispositivo..."
                className="pl-9 w-full md:w-64 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Botón Nuevo */}
            <Button
              onClick={handleOpenCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all w-full md:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" /> Nuevo Dispositivo
            </Button>
          </div>
        </header>

        {/* --- Modal Crear/Editar --- */}
        <Dialog open={isModalOpen} onOpenChange={(open) => { if (!open) setEditingId(null); setIsModalOpen(open); }}>
          <DialogContent className="sm:max-w-[600px] rounded-2xl border-slate-100 shadow-2xl shadow-blue-900/10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Cpu className="w-6 h-6 text-blue-600" />
                </div>
                {editingId ? "Editar Dispositivo" : "Nuevo Dispositivo"}
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Ingrese los detalles técnicos para configurar la telemetría.
              </DialogDescription>
            </DialogHeader>

            {isLoadingEdit && editingId ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-5">
                  {/* Sección Identidad */}
                  <div className="space-y-4 col-span-2 md:col-span-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" /> Identidad
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">Modelo</Label>
                        <Input name="modelo" placeholder="Ej: GPS-X1" value={formData.modelo} onChange={handleInputChange} required className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">IMEI</Label>
                        <Input name="imei" placeholder="8642..." value={formData.imei} onChange={handleInputChange} required className="bg-white font-mono border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">Device Code</Label>
                        <Input name="deviceCode" placeholder="CODE-001" value={formData.deviceCode} onChange={handleInputChange} required className="bg-white font-mono border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">Firmware</Label>
                        <Input name="versionFirmware" placeholder="v1.0" value={formData.versionFirmware} onChange={handleInputChange} className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                      </div>
                    </div>
                  </div>

                  {/* Sección Conectividad */}
                  <div className="space-y-4 col-span-2 md:col-span-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Signal className="w-4 h-4" /> Conectividad
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">SIM Card</Label>
                        <Input name="simNumeroTelefono" placeholder="+51..." value={formData.simNumeroTelefono} onChange={handleInputChange} className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">Operador</Label>
                        <Input name="simOperador" placeholder="Movistar/Claro" value={formData.simOperador} onChange={handleInputChange} className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">Plan</Label>
                        <Input name="simPlan" placeholder="M2M 50MB" value={formData.simPlan} onChange={handleInputChange} className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-500">Estado Inicial</Label>
                        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                          <option value="OFFLINE">Offline</option>
                          <option value="ONLINE">Online</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {editingId ? "Guardar Cambios" : "Registrar"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* --- Modal Eliminar (CORREGIDO) --- */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl shadow-2xl border-0 p-6">

            <DialogHeader className="flex flex-col items-center text-center gap-2">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-2 ring-4 ring-red-50">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>

              <DialogTitle className="text-lg font-bold text-slate-900">
                ¿Eliminar dispositivo?
              </DialogTitle>

              <DialogDescription className="text-sm text-slate-500 leading-relaxed">
                Esta acción eliminará permanentemente el dispositivo
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1 rounded mx-1">#{idToDelete}</span>
              </DialogDescription>
            </DialogHeader>

            {/* CORRECCIÓN: Usamos un div con grid en lugar de DialogFooter para control total */}
            <div className="grid grid-cols-2 gap-3 mt-6 w-full">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-medium hover:text-slate-500"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 font-medium"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sí, Eliminar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* --- Grid de Tarjetas --- */}
        <main className="p-6 md:p-8 max-w-[1600px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredDevices.map((device, idx) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    index={idx}
                    isExpanded={expandedId === device.id}
                    onToggle={() => toggleExpand(device.id)}
                    onEdit={() => handleOpenEdit(device.id)}
                    onDelete={() => handleOpenDelete(device.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {!isLoading && filteredDevices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400/80">
              <div className="bg-blue-50 p-6 rounded-full mb-4">
                <Search className="w-10 h-10 text-blue-300" />
              </div>
              <p className="text-lg font-medium text-slate-600">No se encontraron dispositivos</p>
              <p className="text-sm text-slate-400">Intenta ajustar los filtros o agrega uno nuevo.</p>
            </div>
          )}
        </main>
      </div>
    </TooltipProvider>
  );
}

interface DeviceCardProps {
  device: Dispositivo;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function DeviceCard({ device, index, isExpanded, onToggle, onEdit, onDelete }: DeviceCardProps) {
  const isOnline = device.status === "ONLINE";
  const signalStrength = isOnline ? Math.floor(Math.random() * (100 - 60) + 60) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative"
    >
      <div className={`
                relative overflow-hidden rounded-2xl bg-white border transition-all duration-300
                ${isOnline
          ? 'border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-400'
          : 'border-slate-200 shadow-sm opacity-90 hover:opacity-100 hover:border-slate-300'
        }
            `}>

        <ActivitySparkline active={isOnline} />

        <div className="p-5 pb-0 flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl border transition-colors ${isOnline ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
              {isOnline ? (
                <Wifi className="w-6 h-6 text-blue-600" />
              ) : (
                <span className="relative">
                  <Wifi className="w-6 h-6 text-slate-400 opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-[2px] bg-slate-400 rotate-45 rounded-full" />
                  </div>
                </span>
              )}
              {isOnline && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white"></span>
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {device.modelo}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="bg-slate-50 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-200 group-hover:border-blue-100 group-hover:text-blue-600 transition-colors">
                  ID: {device.id}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50 -mr-2 rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-xl border-blue-100 shadow-lg shadow-blue-900/5">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2 py-1.5">Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer text-xs font-medium py-2 text-slate-600 focus:text-blue-700 focus:bg-blue-50">
                <Pencil className="w-3.5 h-3.5 mr-2" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-xs font-medium py-2 text-red-600 focus:text-red-700 focus:bg-red-50">
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="p-5 relative z-10 space-y-5">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Señal 4G</span>
              <div className="flex items-end gap-[3px] h-4">
                {[1, 2, 3, 4].map(bar => (
                  <div key={bar}
                    className={`w-1.5 rounded-sm transition-all ${isOnline && bar <= (signalStrength > 75 ? 4 : signalStrength > 50 ? 3 : 2)
                      ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                      : 'bg-slate-200'
                      }`}
                    style={{ height: `${bar * 25}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Batería</span>
              <div className="flex items-center justify-end gap-1.5 text-sm font-medium text-slate-700">
                <Battery className={`w-4 h-4 ${isOnline ? 'text-blue-500' : 'text-slate-400'}`} />
                <span>12.4V</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-2 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
            <CopyRow label="IMEI" value={device.imei} icon={<Smartphone className="w-3.5 h-3.5" />} />
            <div className="h-[1px] bg-slate-200/50 w-full" />
            <CopyRow label="CODE" value={device.deviceCode} icon={<Cpu className="w-3.5 h-3.5" />} />
          </div>
        </div>

        <div className="relative z-20 bg-white/80 backdrop-blur-sm border-t border-slate-100">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 grid grid-cols-2 gap-4 text-xs bg-blue-50/30">
                  <DetailItem icon={<Cpu className="w-3.5 h-3.5" />} label="Firmware" value={device.versionFirmware} />
                  <DetailItem icon={<Calendar className="w-3.5 h-3.5" />} label="Creado" value={new Date(device.createdAt).toLocaleDateString()} />
                  <DetailItem icon={<Signal className="w-3.5 h-3.5" />} label="Operador" value={device.simOperador} />
                  <DetailItem icon={<CreditCard className="w-3.5 h-3.5" />} label="Plan" value={device.simPlan} />
                  <div className="col-span-2 pt-2 border-t border-blue-100/50">
                    <DetailItem icon={<Server className="w-3.5 h-3.5" />} label="MQTT User" value={device.mqttUsername || "No configurado"} isError={!device.mqttUsername} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            onClick={onToggle}
            className="w-full h-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-xs font-semibold tracking-wide rounded-none"
          >
            {isExpanded ? (
              <span className="flex items-center gap-1">Ocultar info <ChevronUp className="w-3.5 h-3.5" /></span>
            ) : (
              <span className="flex items-center gap-1">Más detalles <ChevronDown className="w-3.5 h-3.5" /></span>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function CopyRow({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center justify-between group/row cursor-pointer select-none" onClick={handleCopy}>
      <div className="flex items-center gap-2 text-slate-400 group-hover/row:text-blue-500 transition-colors">
        {icon}
        <span className="text-xs font-mono font-medium text-slate-600 group-hover/row:text-blue-700 transition-colors">{value || "N/A"}</span>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="opacity-0 group-hover/row:opacity-100 transition-opacity p-1 hover:bg-white rounded-md shadow-sm ring-1 ring-blue-100">
            {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-blue-400" />}
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="text-xs bg-slate-900 text-white border-0">Copiar</TooltipContent>
      </Tooltip>
    </div>
  );
}

function DetailItem({ icon, label, value, isError }: { icon: any, label: string, value: string, isError?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <span className={`font-mono font-medium pl-5 truncate ${isError ? 'text-red-500' : 'text-slate-700'}`}>{value}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 h-[300px] flex flex-col gap-4 animate-pulse shadow-sm">
      <div className="flex justify-between items-center">
        <div className="w-12 h-12 bg-slate-100 rounded-xl" />
        <div className="w-20 h-6 bg-slate-100 rounded" />
      </div>
      <div className="w-full h-24 bg-slate-50 rounded-xl" />
      <div className="mt-auto w-full h-8 bg-slate-100 rounded" />
    </div>
  );
}