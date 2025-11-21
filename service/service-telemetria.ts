import { nextApi } from "./config/axios_next";
import { GpsTelemetria } from "@/interface/telemetria-dispostivo";


export const gpsTelemetriaService = {
    // Obtener la última telemetría de un dispositivo
    async getLastByDevice(gpsDeviceId: number): Promise<GpsTelemetria> {
        const res = await nextApi.get<GpsTelemetria>(
            `/gps-telemetria/device/${gpsDeviceId}/last`
        );
        return res.data;
    },


    // 🔹 Eliminar todas las telemetrías de un dispositivo
    async deleteByDevice(gpsDeviceId: number): Promise<void> {
        await nextApi.delete(`/gps-telemetria/device/${gpsDeviceId}`);
    },
};