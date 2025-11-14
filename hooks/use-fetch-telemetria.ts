import { useQuery } from "@tanstack/react-query";
import { gpsTelemetriaService } from "@/service/service-telemetria";
import { GpsTelemetria } from "@/interface/telemetria-dispostivo";

// 🔹 Obtener la última telemetría de un dispositivo
export function useLastTelemetriaByDevice(gpsDeviceId: number) {
    return useQuery<GpsTelemetria>({
        queryKey: ["gpsTelemetria", gpsDeviceId, "last"],
        queryFn: () => gpsTelemetriaService.getLastByDevice(gpsDeviceId),
        enabled: !!gpsDeviceId, // evita ejecutar si gpsDeviceId es 0/null
        //refetchInterval: 10_000, // opcional: refresca cada 10s para tener datos casi en tiempo real
    });
}