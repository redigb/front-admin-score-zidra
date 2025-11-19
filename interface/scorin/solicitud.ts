export interface Solicitud {
  id: number;
  preClienteId: number;
  montoTotal: number;
  montoInicial: number;
  numeroCuotas: number;
  frecuenciaPago: string;
  interes: number;
  montoCuota: number;
  totalPagar: number;
  estadoPredicente: string;
  fechaSolicitud: string;
  usuarioAsesorId: number;
  preClienteNombre?: string;
}