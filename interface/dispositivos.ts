
export interface Dispositivo {
    id: number;
    deviceCode: string;
    imei: string;
    modelo: string;
    versionFirmware: string;
    status: "ONLINE" | "OFFLINE"; // 👈 restringimos a valores conocidos
    simNumeroTelefono: string;
    simOperador: string;
    simPlan: string;
    mqttUsername: string | null;
    mqttPassword: string | null;
    createdAt: string; // viene como ISO string
}

export interface DispositivoCreate {
  deviceCode: string;
  imei: string;
  modelo: string;
  versionFirmware: string;
  status: "ONLINE" | "OFFLINE";
  simNumeroTelefono: string;
  simOperador: string;
  simPlan: string;
}