"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispositivos } from "@/hooks/use-fetch-dipositivos";
import {
    useArtefactoGpsLinks,
    useCreateLink,
    useDesvincularLink,
} from "@/hooks/use-fetch-link-artefacto";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Loader2,
    Link2,
    Unlink,
    Box, 
    Navigation, 
    Calendar,
    Search,
    Plus,
    History,
    ArrowRightLeft,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

export default function VinculosArtefactos() {
    const { data: rawLinks, isLoading } = useArtefactoGpsLinks();
    const { data: dispositivos = [] } = useDispositivos();

    const links = useMemo(() => Array.isArray(rawLinks) ? rawLinks : [], [rawLinks]);

    const [artefactoId, setArtefactoId] = useState("");
    const [gpsId, setGpsId] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Estados para confirmación de desvinculación
    const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
    const [linkToUnlink, setLinkToUnlink] = useState<number | null>(null);

    const createLink = useCreateLink();
    const desvincularLink = useDesvincularLink();

    const handleSubmit = async () => {
        if (!artefactoId || !gpsId) {
            toast.error("Debes completar ambos campos");
            return;
        }
        try {
            await createLink.mutateAsync({ pocketbaseArtefactoId: artefactoId, gpsDeviceId: Number(gpsId) });
            toast.success("Vínculo creado exitosamente");
            setIsModalOpen(false);
            setArtefactoId("");
            setGpsId("");
        } catch (error) {
            console.error(error);
            toast.error("Error al crear el vínculo");
        }
    };

    const handleRequestDesvincular = (id: number) => {
        setLinkToUnlink(id);
        setIsUnlinkModalOpen(true);
    };

    const confirmDesvincular = async () => {
        if (!linkToUnlink) return;
        try {
            await desvincularLink.mutateAsync(linkToUnlink);
            toast.success("Dispositivo desvinculado correctamente");
            setIsUnlinkModalOpen(false);
            setLinkToUnlink(null);
        } catch (error) {
            console.error(error);
            toast.error("Error al desvincular");
        }
    };

    const filteredLinks = links.filter(link => 
        link.pocketbaseArtefactoId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.gpsDeviceId.toString().includes(searchTerm)
    );

    // CORRECCIÓN LÓGICA: Usamos "ACTIVO" según tu JSON
    const activeLinksCount = links.filter(l => l.estado === "ACTIVO").length;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            
            <header className="w-full border-b border-blue-100 bg-white/80 backdrop-blur-xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                        <Link2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                            Gestión de <span className="text-blue-600">Vínculos</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1 text-xs font-medium">
                            <span className="text-slate-500">Relación Artefacto - GPS:</span>
                            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                {activeLinksCount} Activos
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative group w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input 
                            placeholder="Buscar ID Artefacto o GPS..." 
                            className="pl-9 w-full md:w-64 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all w-full md:w-auto">
                                <Plus className="w-5 h-5 mr-2" /> Nuevo Vínculo
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-2xl border-slate-100 shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                                    Asignar GPS a Artefacto
                                </DialogTitle>
                                <DialogDescription>
                                    Crea una relación lógica entre un identificador de artefacto y un dispositivo físico.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-5 py-4">
                                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <Label className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                                        <Box className="w-3.5 h-3.5" /> ID del Artefacto
                                    </Label>
                                    <Input 
                                        placeholder="Ej: ARTEFACTO-001-X" 
                                        value={artefactoId}
                                        onChange={(e) => setArtefactoId(e.target.value)}
                                        className="bg-white border-slate-200 font-mono text-sm focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <Label className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                                        <Navigation className="w-3.5 h-3.5" /> Dispositivo GPS
                                    </Label>
                                    <Select value={gpsId} onValueChange={setGpsId}>
                                        <SelectTrigger className="w-full bg-white border-slate-200 focus:ring-blue-500">
                                            <SelectValue placeholder="Seleccione un dispositivo disponible..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dispositivos.map((d) => (
                                                <SelectItem key={d.id} value={d.id.toString()}>
                                                    <span className="font-medium">#{d.id}</span> — {d.modelo} <span className="text-slate-400 text-xs">({d.imei})</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                <Button onClick={handleSubmit} disabled={createLink.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {createLink.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                    Crear Vínculo
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <main className="p-6 md:p-8 max-w-[1600px] mx-auto">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {[...Array(6)].map((_, i) => (
                             <div key={i} className="h-48 bg-white rounded-2xl border border-slate-100 animate-pulse" />
                         ))}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                            {filteredLinks.length > 0 ? (
                                filteredLinks.map((link, index) => (
                                    <LinkCard 
                                        key={link.id || index} 
                                        link={link} 
                                        onRequestDesvincular={() => handleRequestDesvincular(link.id)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400">
                                    <div className="bg-blue-50 p-6 rounded-full mb-4">
                                        <Link2 className="w-12 h-12 text-blue-200" />
                                    </div>
                                    <p className="text-lg font-medium text-slate-600">No hay vínculos registrados</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {/* Modal Confirmación Desvincular */}
            <Dialog open={isUnlinkModalOpen} onOpenChange={setIsUnlinkModalOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl shadow-2xl border-0 p-6">
                    <DialogHeader className="flex flex-col items-center text-center gap-2">
                        <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mb-2 ring-4 ring-amber-50">
                            <AlertTriangle className="w-7 h-7 text-amber-500" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            ¿Desvincular dispositivo?
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500 leading-relaxed">
                            Estás a punto de romper la relación entre el artefacto y el GPS. 
                            El registro pasará al historial.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsUnlinkModalOpen(false)} 
                            className="w-full rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={confirmDesvincular} 
                            disabled={desvincularLink.isPending}
                            className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-100"
                        >
                            {desvincularLink.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sí, Desvincular"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

// --- Tarjeta de Vínculo (Lógica Corregida) ---
interface LinkCardProps {
    link: any;
    onRequestDesvincular: () => void;
}

function LinkCard({ link, onRequestDesvincular }: LinkCardProps) {
    // CORRECCIÓN CRÍTICA: Usar "ACTIVO" en lugar de "ASIGNADO"
    const isAssigned = link.estado === "ACTIVO";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
                relative flex flex-col justify-between rounded-2xl border transition-all duration-300 overflow-hidden
                ${isAssigned 
                    // ESTILO ACTIVO: Blanco, borde azul claro, sombra
                    ? "bg-white border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-100/50" 
                    // ESTILO RETIRADO: Gris, borde punteado, opaco
                    : "bg-slate-100 border-slate-300 border-dashed opacity-75 grayscale"
                }
            `}
        >
            {isAssigned && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl pointer-events-none" />
            )}

            <div className="p-5 relative z-10">
                <div className="flex justify-between items-start mb-6">
                    {/* Badge de Estado */}
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1.5 ${
                        isAssigned 
                        ? "bg-blue-50 text-blue-700 border-blue-200" 
                        : "bg-slate-200 text-slate-600 border-slate-300"
                    }`}>
                        {isAssigned ? (
                            <>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                {link.estado} {/* Muestra "ACTIVO" */}
                            </>
                        ) : (
                            <>
                                <History className="w-3 h-3" />
                                FINALIZADO
                            </>
                        )}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        {link.fechaAsignacion ? new Date(link.fechaAsignacion).toLocaleDateString() : '--/--/--'}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Artefacto */}
                    <div className="flex items-center gap-3 group">
                        <div className={`p-2 rounded-lg transition-colors ${isAssigned ? "bg-blue-50 text-blue-600" : "bg-white text-slate-400"}`}>
                            <Box className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Artefacto</p>
                            <p className="text-sm font-mono font-semibold text-slate-700 truncate" title={link.pocketbaseArtefactoId}>
                                {link.pocketbaseArtefactoId}
                            </p>
                        </div>
                    </div>

                    {/* Línea conectora */}
                    <div className="pl-4 py-1">
                        <div className={`w-0.5 h-4 ${isAssigned ? "bg-blue-200" : "bg-slate-300"}`} />
                    </div>

                    {/* GPS */}
                    <div className="flex items-center gap-3 group">
                        <div className={`p-2 rounded-lg transition-colors ${isAssigned ? "bg-indigo-50 text-indigo-600" : "bg-white text-slate-400"}`}>
                            <Navigation className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">GPS Device</p>
                            <p className="text-sm font-mono font-semibold text-slate-700">
                                ID: {link.gpsDeviceId}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer: Solo aparece si está ACTIVO */}
            {isAssigned ? (
                <div className="p-4 border-t border-blue-50 bg-blue-50/30">
                    <Button 
                        variant="ghost" 
                        onClick={onRequestDesvincular}
                        className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-9 text-xs font-semibold border border-transparent hover:border-amber-100 transition-all"
                    >
                        <Unlink className="w-3.5 h-3.5 mr-2" />
                        Desvincular
                    </Button>
                </div>
            ) : (
                <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
                    <p className="text-[10px] font-medium text-slate-400 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Historial
                    </p>
                </div>
            )}
        </motion.div>
    );
}