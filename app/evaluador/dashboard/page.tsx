"use client";
import { useState } from "react";

export default function Dashboard() {
  const [hoveredCard, setHoveredCard] = useState("");

  const handleMouseEnter = (cardName: string) => {
    setHoveredCard(cardName);
  };

  const handleMouseLeave = () => {
    setHoveredCard("");
  };

  return (
    <div className="p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Card: Total Solicitudes */}
        <div
          className="bg-card text-card-foreground p-4 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow"
          onMouseEnter={() => handleMouseEnter("Ver todas las solicitudes")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium">Total Solicitudes</p>
            <p className="text-xl font-bold">2,450</p>
          </div>
        </div>

        {/* Card: Aprobadas */}
        <div
          className="bg-card text-card-foreground p-4 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow"
          onMouseEnter={() => handleMouseEnter("Ver solicitudes aprobadas")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium">Aprobadas</p>
            <p className="text-xl font-bold">1,982</p>
          </div>
        </div>

        {/* Card: Rechazadas */}
        <div
          className="bg-card text-card-foreground p-4 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow"
          onMouseEnter={() => handleMouseEnter("Ver solicitudes rechazadas")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex-shrink-0 bg-red-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium">Rechazadas</p>
            <p className="text-xl font-bold">450</p>
          </div>
        </div>

        {/* Card: Pendientes */}
        <div
          className="bg-card text-card-foreground p-4 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow"
          onMouseEnter={() => handleMouseEnter("Ver solicitudes pendientes")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16h8M8 12h8m-6 8h4"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium">Pendientes</p>
            <p className="text-xl font-bold">18</p>
          </div>
        </div>

        {/* Texto flotante */}
        {hoveredCard && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-neutral-800 text-white px-4 py-2 rounded-lg shadow-lg">
            {hoveredCard}
          </div>
        )}
      </div>
    </div>
  );
}