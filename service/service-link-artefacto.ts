import { nextApi } from "./config/axios_next";
import { ArtefactoGpsLink, ArtefactoGpsLinkCreate } from "@/interface/artefacto-gps";


export const artefactoGpsLinkService = {

    // Obtener todos los vínculos artefacto-gps
    async getAll(): Promise<ArtefactoGpsLink[]> {
        const res = await nextApi.get<ArtefactoGpsLink[]>("/artefacto-gps-link");
        return res.data;
    },

    // Obtener vínculos filtrados por artefacto
    async getByArtefacto(pocketbaseArtefactoId: string): Promise<ArtefactoGpsLink[]> {
        const res = await nextApi.get<ArtefactoGpsLink[]>(
            `/artefacto-gps-link/artefacto/${pocketbaseArtefactoId}`
        );
        return res.data;
    },

    // 🔹 Obtener vínculos activos filtrados por GPS
    async getActivosByGps(gpsDeviceId: number): Promise<ArtefactoGpsLink[]> {
        const res = await nextApi.get<ArtefactoGpsLink[]>(
            `/artefacto-gps-link/gps/${gpsDeviceId}/activo`
        );
        return res.data;
    },

    // 🔹 Asignar un vínculo (crear relación Artefacto <-> GPS)
    async create(data: ArtefactoGpsLinkCreate): Promise<ArtefactoGpsLink> {
        const res = await nextApi.post<ArtefactoGpsLink>("/artefacto-gps-link", data);
        return res.data;
    },

    // 🔹 Desvincular vínculo por ID
    async desvincular(id: number): Promise<ArtefactoGpsLink> {
        const res = await nextApi.put<ArtefactoGpsLink>(`/artefacto-gps-link/${id}/desvincular`);
        return res.data;
    },

};