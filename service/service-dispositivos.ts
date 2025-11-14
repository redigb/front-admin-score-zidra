import { authApi } from "./config/axios_next";
import { Dispositivo, DispositivoCreate } from "@/interface/dispositivos";


export const dispositivosService = {
    // Obtener todos los dispositivos
    async getAll(): Promise<Dispositivo[]> {
        const res = await authApi.get<Dispositivo[]>("/ioti-gps");
        return res.data;
    },

    // 🔹 Obtener un dispositivo por ID
    async getById(id: number): Promise<Dispositivo> {
        const res = await authApi.get<Dispositivo>(`/ioti-gps/${id}`);
        return res.data;
    },

    // 🔹 Obtener un dispositivo por IMEI
    async getByImei(imei: string): Promise<Dispositivo> {
        const res = await authApi.get<Dispositivo>(`/ioti-gps/imei/${imei}`);
        return res.data;
    },

    // 🔹 Crear un dispositivo nuevo
    async create(data: DispositivoCreate): Promise<Dispositivo> {
        const res = await authApi.post<Dispositivo>("/ioti-gps", data);
        return res.data;
    },

    async update(id: number, data: DispositivoCreate): Promise<Dispositivo> {
        const res = await authApi.put<Dispositivo>(`/ioti-gps/${id}`, data);
        return res.data;
    },

    // 🔹 Eliminar un dispositivo por ID
    async delete(id: number): Promise<void> {
        await authApi.delete(`/ioti-gps/${id}`);
    },
};