
export interface GpsTelemetria {
  id: number;
  gpsDeviceId: number;
  fechaHora: string;      // ISO string
  latitud: number;
  longitud: number;
  speed: number;
  estadoEncendido: boolean;
  extraData: Record<string, any>; 
  // 🔹 Usamos Record<string, any> porque los datos pueden variar
  // Ejemplo: { fuente: "Corriente", altitud: 650, bateria: 100, temperatura: 26 }
}