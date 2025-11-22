import { nextApi } from "./config/axios_next";
import { Dispositivo, DispositivoCreate } from "@/interface/dispositivos";

export const dispositivosService = {
    // Obtener todos los dispositivos
    // La llamada real será: GET /api/proxy/ioti-gps -> Backend: GET /api/ioti-gps
    async getAll(): Promise<Dispositivo[]> {
        const res = await nextApi.get<Dispositivo[]>("/ioti-gps");
        return res.data;
    },

    // 🔹 Obtener un dispositivo por ID
    async getById(id: number): Promise<Dispositivo> {
        const res = await nextApi.get<Dispositivo>(`/ioti-gps/${id}`);
        return res.data;
    },

    // 🔹 Obtener un dispositivo por IMEI
    async getByImei(imei: string): Promise<Dispositivo> {
        const res = await nextApi.get<Dispositivo>(`/ioti-gps/imei/${imei}`);
        return res.data;
    },

    // 🔹 Crear un dispositivo nuevo
    // NextApi enviará esto a /api/proxy/ioti-gps (POST), el route handler tomará el body y lo pasará al backend
    async create(data: DispositivoCreate): Promise<Dispositivo> {
        try {
            const res = await nextApi.post<Dispositivo>("/ioti-gps", data);
            return res.data;
        } catch (err: any) {
            throw err.response?.data || err;
        }
    },


    // 🔹 Actualizar dispositivo
    async update(id: number, data: DispositivoCreate): Promise<Dispositivo> {
        const res = await nextApi.put<Dispositivo>(`/ioti-gps/${id}`, data);
        return res.data;
    },

    // 🔹 Eliminar un dispositivo por ID
    async delete(id: number): Promise<void> {
        await nextApi.delete(`/ioti-gps/${id}`);
    },
};