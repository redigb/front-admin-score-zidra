"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Loader2,
    Link as LinkIcon,
    Unlink,
    Cpu,
    Satellite,
} from "lucide-react";

export default function VinculosArtefactos() {
    const { data: links = [], isLoading } = useArtefactoGpsLinks();
    const { data: dispositivos = [] } = useDispositivos();
    const [artefactoId, setArtefactoId] = useState("");
    const [gpsId, setGpsId] = useState<number | null>(null);

    const createLink = useCreateLink();
    const desvincularLink = useDesvincularLink();

    const handleSubmit = () => {
        if (!artefactoId || !gpsId) return;
        createLink.mutate({ pocketbaseArtefactoId: artefactoId, gpsDeviceId: gpsId });
    };

    return (
        <div className="p-8 space-y-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
                    <LinkIcon className="w-7 h-7 text-blue-600" />
                    Vínculos Artefacto - GPS
                </h1>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-xl px-5 py-2">
                            + Nuevo Vínculo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl max-w-md shadow-2xl">
                        <DialogHeader className="space-y-1">
                            <DialogTitle className="flex items-center gap-2 text-blue-700 text-xl">
                                <Cpu className="w-6 h-6 text-blue-600" />
                                Asignar Vínculo
                            </DialogTitle>
                            <p className="text-sm text-gray-500">
                                Relaciona un artefacto con un dispositivo GPS disponible
                            </p>
                        </DialogHeader>

                        <div className="space-y-5 mt-4">
                            {/* Artefacto */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Artefacto ID
                                </label>
                                <Input
                                    placeholder="Ej: vzmqltcpis02yq2"
                                    value={artefactoId}
                                    onChange={(e) => setArtefactoId(e.target.value)}
                                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl"
                                />
                            </div>

                            {/* Dispositivo GPS */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dispositivo GPS
                                </label>
                                <select
                                    value={gpsId ?? ""}
                                    onChange={(e) => setGpsId(Number(e.target.value))}
                                    className="w-full border border-blue-200 rounded-xl p-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione un dispositivo</option>
                                    {dispositivos.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            #{d.id} – {d.modelo} ({d.imei})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botón */}
                            <Button
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-xl py-2 shadow-md"
                                disabled={createLink.isPending}
                            >
                                {createLink.isPending && (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                )}
                                Asignar vínculo
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Lista vínculos */}
            {isLoading ? (
                <div className="flex justify-center items-center h-40 text-blue-600">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Cargando vínculos...
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {links.map((link, index) => (
                        <motion.div
                            key={link.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col justify-between bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition cursor-pointer"
                        >
                            <div className="space-y-2">
                                <p className="text-sm text-gray-700">
                                    <b>Artefacto:</b> {link.pocketbaseArtefactoId}
                                </p>
                                <p className="text-sm text-gray-700 flex items-center gap-1">
                                    <Satellite className="w-4 h-4 text-blue-500" />
                                    <b>GPS:</b> #{link.gpsDeviceId}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Estado:{" "}
                                    <span
                                        className={
                                            link.estado === "ASIGNADO"
                                                ? "text-green-600 font-semibold"
                                                : "text-red-600 font-semibold"
                                        }
                                    >
                                        {link.estado}
                                    </span>{" "}
                                    · {new Date(link.fechaAsignacion).toLocaleString()}
                                </p>
                            </div>

                            <Button
                                className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-100/60 rounded-lg mt-4 self-end shadow-none transition-colors"
                                onClick={() => desvincularLink.mutate(link.id)}
                                disabled={desvincularLink.isPending}
                            >
                                {desvincularLink.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                ) : (
                                    <Unlink className="w-4 h-4 mr-1" />
                                )}
                                Desvincular
                            </Button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
