import { useState, useEffect } from "react";
import L from "leaflet";

// 🎨 Icono animado con flecha, gradiente y respiración
export const createBreathingIcon = () => {
    const colors = [
        "from-blue-500 to-cyan-400",
        "from-emerald-500 to-teal-400",
        "from-rose-500 to-pink-400",
        "from-purple-500 to-fuchsia-400",
        "from-amber-500 to-orange-400",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return L.divIcon({
        className: "",
        html: `
      <div class="relative w-10 h-10 flex items-center justify-center">
        <!-- Halo respirando -->
        <div class="absolute w-10 h-10 rounded-full bg-gradient-to-r ${color} animate-ping opacity-40"></div>
        
        <!-- Esfera central -->
        <div class="absolute w-5 h-5 rounded-full bg-gradient-to-r ${color} shadow-lg"></div>

        <!-- Triángulo apuntando hacia la esfera -->
        <div class="absolute -bottom-2 w-0 h-0 
                    border-l-[6px] border-r-[6px] border-t-[10px] 
                    border-l-transparent border-r-transparent border-t-black
                    drop-shadow-md">
        </div>
      </div>
    `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
    });
};

// 🎯 Componente para Popup con dirección
export const DevicePopup = ({
    device,
    telemetria,
}: {
    device: any;
    telemetria: any;
}) => {
    const [address, setAddress] = useState<string>("Buscando dirección...");

    useEffect(() => {
        if (!telemetria) return;

        const fetchAddress = async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${telemetria.latitud}&lon=${telemetria.longitud}&zoom=18&addressdetails=1`
                );
                const data = await res.json();
                setAddress(
                    data.display_name || "Dirección no disponible"
                );
            } catch {
                setAddress("No se pudo obtener dirección");
            }
        };

        fetchAddress();
    }, [telemetria]);

    return (
        <div>
            <h3 className="font-bold">{device.modelo}</h3>
            <p>IMEI: {device.imei}</p>
            <p>
                Velocidad: {telemetria.speed} km/h <br />
                {telemetria.estadoEncendido ? "Encendido" : "Apagado"}
            </p>
            <p className="text-xs text-gray-500">
                {new Date(telemetria.fechaHora).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-blue-600">
                📍 {address}
            </p>

            {/* Coordenadas */}
            <p className="text-xs text-gray-600 mt-1 font-mono">
                🌐 Lat: {telemetria.latitud.toFixed(6)}, Lng:{" "}
                {telemetria.longitud.toFixed(6)}
            </p>
        </div>
    );
};
