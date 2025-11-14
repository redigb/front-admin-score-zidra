import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { artefactoGpsLinkService } from "@/service/service-link-artefacto";
import { ArtefactoGpsLink, ArtefactoGpsLinkCreate } from "@/interface/artefacto-gps";

import { toast } from "sonner";

// 🔹 Obtener todos los vínculos artefacto-gps
export function useArtefactoGpsLinks() {
    return useQuery<ArtefactoGpsLink[]>({
        queryKey: ["artefactoGpsLinks"],
        queryFn: () => artefactoGpsLinkService.getAll(),
    });
}

// 🔹 Obtener vínculos filtrados por artefacto
export function useArtefactoGpsLinksByArtefacto(pocketbaseArtefactoId: string) {
    return useQuery<ArtefactoGpsLink[]>({
        queryKey: ["artefactoGpsLinks", "artefacto", pocketbaseArtefactoId],
        queryFn: () => artefactoGpsLinkService.getByArtefacto(pocketbaseArtefactoId),
        enabled: !!pocketbaseArtefactoId, // evita ejecutar si no hay artefactoId
    });
}

// 🔹 Obtener vínculos activos filtrados por GPS
export function useArtefactoGpsLinksActivosByGps(gpsDeviceId: number) {
    return useQuery<ArtefactoGpsLink[]>({
        queryKey: ["artefactoGpsLinks", "gps", gpsDeviceId, "activo"],
        queryFn: () => artefactoGpsLinkService.getActivosByGps(gpsDeviceId),
        enabled: !!gpsDeviceId, // evita ejecutar si gpsDeviceId es 0/null
    });
}

export function useCreateLink() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ArtefactoGpsLinkCreate) =>
            artefactoGpsLinkService.create(data),
        onSuccess: () => {
            toast.success("✅ Vínculo creado correctamente");
            queryClient.invalidateQueries({ queryKey: ["artefactoGpsLinks"] });
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message || "❌ Error al crear el vínculo";
            toast.error(message);
        },
    });
}

export function useDesvincularLink() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => artefactoGpsLinkService.desvincular(id),
        onSuccess: () => {
            toast.success("🔗 Vínculo desvinculado");
            queryClient.invalidateQueries({ queryKey: ["artefactoGpsLinks"] });
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message || "❌ Error al desvincular vínculo";
            toast.error(message);
        },
    });
}