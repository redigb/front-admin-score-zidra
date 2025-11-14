
import { useQuery } from "@tanstack/react-query";
import { dispositivosService } from "@/service/service-dispositivos";
import { Dispositivo } from "@/interface/dispositivos";

// 🔹 Obtener todos los dispositivos
export function useDispositivos() {
    return useQuery<Dispositivo[]>({
        queryKey: ["dispositivos"],
        queryFn: () => dispositivosService.getAll(),
    });
}

// 🔹 Obtener un dispositivo por ID
export function useDispositivoById(id: number) {
    return useQuery<Dispositivo>({
        queryKey: ["dispositivos", id],
        queryFn: () => dispositivosService.getById(id),
        enabled: !!id, // evita ejecutar si id es null/undefined
    });
}

// 🔹 Obtener un dispositivo por IMEI
export function useDispositivoByImei(imei: string) {
    return useQuery<Dispositivo>({
        queryKey: ["dispositivos", "imei", imei],
        queryFn: () => dispositivosService.getByImei(imei),
        enabled: !!imei, // evita ejecutar si imei está vacío
    });
}