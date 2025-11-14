import { User, FileText, TrendingUp, CheckCircle, XCircle, Calculator } from "lucide-react";

// Datos mock de solicitudes
const solicitudesData = [
  {
    id: "SOL-00123",
    dni: "78541236",
    cliente: "Luciana Quispe Mendoza",
    direccion: "Av. Javier Prado Este 2465, San Borja, Lima, Perú",
    email: "luciana.quispe.m@email.com",
    telefono: "+51 987 654 321",
    monto: "S/ 15,000.00",
    cuotas: 36,
    interes: "18.5%",
    frecuencia: "Mensual",
    fecha: "29 de Julio, 2024",
    estado: "Aprobado",
    riesgo: "18%",
    riesgoNivel: "Riesgo Bajo",
    modelo: "PeruRiskModel v1.5",
    variables: [
      "Ingresos: S/ 4,200/mes",
      "Antigüedad laboral: 4 años",
      "Historial crediticio: Bueno",
      "Ratio deuda/ingresos: 22%"
    ],
    interpretacion: "El modelo de Machine Learning asigna un riesgo bajo (18%). El perfil del solicitante es sólido, destacando una antigüedad laboral estable de 4 años, un buen historial crediticio en centrales de riesgo peruanas y un ratio de endeudamiento saludable (22%). Estos factores indican una alta probabilidad de cumplimiento. La aprobación del crédito es recomendable."
  },
  {
    id: "SOL-00124",
    dni: "45678912",
    cliente: "María García",
    direccion: "Jr. Los Pinos 234, Miraflores, Lima, Perú",
    email: "maria.garcia@email.com",
    telefono: "+51 912 345 678",
    monto: "S/ 5,000.00",
    cuotas: 24,
    interes: "20.5%",
    frecuencia: "Mensual",
    fecha: "25 de Octubre, 2023",
    estado: "Pendiente",
    riesgo: "42%",
    riesgoNivel: "Riesgo Medio",
    modelo: "PeruRiskModel v1.5",
    variables: [
      "Ingresos: S/ 2,800/mes",
      "Antigüedad laboral: 2 años",
      "Historial crediticio: Regular",
      "Ratio deuda/ingresos: 45%"
    ],
    interpretacion: "El modelo asigna un riesgo medio (42%). Se requiere evaluación adicional del asesor para determinar la viabilidad del crédito."
  },
  {
    id: "SOL-00125",
    dni: "23456789",
    cliente: "Carlos Martínez",
    direccion: "Av. Colonial 1234, Callao, Perú",
    email: "carlos.martinez@email.com",
    telefono: "+51 923 456 789",
    monto: "S/ 25,000.00",
    cuotas: 48,
    interes: "22.5%",
    frecuencia: "Mensual",
    fecha: "24 de Octubre, 2023",
    estado: "Rechazado",
    riesgo: "78%",
    riesgoNivel: "Riesgo Alto",
    modelo: "PeruRiskModel v1.5",
    variables: [
      "Ingresos: S/ 3,500/mes",
      "Antigüedad laboral: 6 meses",
      "Historial crediticio: Malo",
      "Ratio deuda/ingresos: 78%"
    ],
    interpretacion: "El modelo asigna un riesgo alto (78%). El alto ratio de endeudamiento y el historial crediticio negativo sugieren rechazo de la solicitud."
  },
  {
    id: "SOL-00126",
    dni: "34567891",
    cliente: "Laura Hernández",
    direccion: "Calle Las Flores 567, Surco, Lima, Perú",
    email: "laura.hernandez@email.com",
    telefono: "+51 934 567 891",
    monto: "S/ 12,000.00",
    cuotas: 30,
    interes: "19.5%",
    frecuencia: "Mensual",
    fecha: "23 de Octubre, 2023",
    estado: "Aprobado",
    riesgo: "21%",
    riesgoNivel: "Riesgo Bajo",
    modelo: "PeruRiskModel v1.5",
    variables: [
      "Ingresos: S/ 5,000/mes",
      "Antigüedad laboral: 5 años",
      "Historial crediticio: Excelente",
      "Ratio deuda/ingresos: 18%"
    ],
    interpretacion: "El modelo asigna un riesgo bajo (21%). Perfil crediticio excelente con alta probabilidad de cumplimiento. Aprobación recomendada."
  },
  {
    id: "SOL-00127",
    dni: "56789123",
    cliente: "Pedro López",
    direccion: "Av. Universitaria 890, Los Olivos, Lima, Perú",
    email: "pedro.lopez@email.com",
    telefono: "+51 945 678 912",
    monto: "S/ 8,500.00",
    cuotas: 18,
    interes: "21.0%",
    frecuencia: "Mensual",
    fecha: "22 de Octubre, 2023",
    estado: "Pendiente",
    riesgo: "33%",
    riesgoNivel: "Riesgo Medio",
    modelo: "PeruRiskModel v1.5",
    variables: [
      "Ingresos: S/ 3,200/mes",
      "Antigüedad laboral: 3 años",
      "Historial crediticio: Bueno",
      "Ratio deuda/ingresos: 35%"
    ],
    interpretacion: "El modelo asigna un riesgo medio (33%). Se requiere análisis adicional para tomar una decisión final."
  },
];

// Función requerida para output: export
export async function generateStaticParams() {
  return solicitudesData.map((solicitud) => ({
    id: solicitud.id,
  }));
}

export default function DetalleSolicitud({ params }: { params: { id: string } }) {
  const { id } = params;

  const solicitud = solicitudesData.find((sol) => sol.id === id);

  if (!solicitud) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-red-500 text-lg">Solicitud no encontrada.</p>
          <div className="flex justify-center mt-4">
            <a
              href="/evaluador/solicitudes"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Volver a Solicitudes
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Detalle de Solicitud de Crédito</h1>
          <p className="text-sm text-gray-500 mt-1">ID de Solicitud: #{solicitud.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del Pre-cliente */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Información del Pre-cliente</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">DNI</p>
                  <p className="text-base font-medium text-gray-900">{solicitud.dni}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nombre Completo</p>
                  <p className="text-base font-medium text-gray-900">{solicitud.cliente}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Dirección</p>
                  <p className="text-base font-medium text-gray-900">{solicitud.direccion}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-base font-medium text-gray-900">{solicitud.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                  <p className="text-base font-medium text-gray-900">{solicitud.telefono}</p>
                </div>
              </div>
            </div>

            {/* Información de la Solicitud */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Información de la Solicitud</h2>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Monto Solicitado</p>
                  <p className="text-xl font-bold text-gray-900">{solicitud.monto}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cuotas</p>
                  <p className="text-xl font-bold text-gray-900">{solicitud.cuotas}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Interés (TEA)</p>
                  <p className="text-xl font-bold text-gray-900">{solicitud.interes}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Frecuencia de Pago</p>
                  <p className="text-base font-medium text-gray-900">{solicitud.frecuencia}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Fecha de Solicitud</p>
                  <p className="text-base font-medium text-gray-900">{solicitud.fecha}</p>
                </div>
              </div>
            </div>

            {/* Scoring ML & Interpretación */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Scoring ML & Interpretación</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Riesgo Crediticio */}
                <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-green-700">Riesgo Crediticio</p>
                  </div>
                  <p className="text-5xl font-bold text-green-600 mb-2">{solicitud.riesgo}</p>
                  <p className="text-sm font-semibold text-green-700">{solicitud.riesgoNivel}</p>
                </div>

                {/* Modelo Utilizado */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Modelo Utilizado</p>
                  <p className="text-lg font-bold text-gray-900 mb-4">{solicitud.modelo}</p>
                  
                  <p className="text-sm font-medium text-gray-700 mb-2">Variables Principales</p>
                  <div className="space-y-2">
                    {solicitud.variables.map((variable, index) => (
                      <div key={index} className="inline-block bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2">
                        {variable}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interpretación por LLM */}
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-900">Interpretación por LLM</p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{solicitud.interpretacion}</p>
              </div>
            </div>
          </div>

          {/* Columna de Acciones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <CheckCircle className="w-5 h-5" />
                  Aprobar
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <XCircle className="w-5 h-5" />
                  Rechazar
                </button>
                <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <Calculator className="w-5 h-5" />
                  Recalcular Scoring
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <a
                  href="/evaluador/solicitudes"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-center"
                >
                  ← Volver a Solicitudes
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}