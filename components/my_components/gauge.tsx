


export default function Gauge({ value }: { value: number }) {
  const angle = (value / 100) * 180; 

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="relative w-56 h-28 overflow-hidden">
        {/* Semicírculo con gradiente */}
        <div
          className="absolute inset-0 rounded-t-full"
          style={{
            background:
              "linear-gradient(90deg, #16A34A 0%, #EAB308 50%, #DC2626 100%)",
          }}
        ></div>

        {/* Recorte inferior */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>

        {/* Aguja */}
        <div
          className="absolute bottom-0 left-1/2 w-1 h-24 bg-gray-800 origin-bottom rounded"
          style={{
            transform: `translateX(-50%) rotate(${angle - 90}deg)`,
            transition: "all 0.6s ease",
          }}
        ></div>
      </div>

      <p className="text-3xl font-bold mt-3 text-gray-900">
        {value.toFixed(1)}%
      </p>
      <p className="text-gray-600 text-sm mb-2">Riesgo Crediticio</p>
    </div>
  );
}