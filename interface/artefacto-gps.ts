

export interface ArtefactoGpsLink {
    id: number;
    pocketbaseArtefactoId: string;
    gpsDeviceId: number;
    fechaAsignacion: string;       // ISO string
    fechaDesvinculacion: string;   // ISO string o null si sigue activo
    estado: "ACTIVO" | "RETIRADO"; // 🔹 restringimos a valores conocidos
}

export interface ArtefactoGpsLinkCreate {
    pocketbaseArtefactoId: string;
    gpsDeviceId: number;
}