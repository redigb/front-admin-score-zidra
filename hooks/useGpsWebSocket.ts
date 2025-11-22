"use client";

import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { GpsTelemetria } from "@/interface/telemetria-dispostivo";

export function useGpsWebSocket(
  gpsDeviceId: number | null,
  onMessage: (telemetria: GpsTelemetria) => void,
  enabled: boolean
) {
  // Referencia para mantener la instancia del cliente STOMP sin causar re-renders
  const stompClient = useRef<Client | null>(null);

  // Referencia para el callback, evita reconexiones si la función onMessage cambia
  const onMessageRef = useRef(onMessage);

  // Actualizamos la ref del callback cada vez que cambia
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    // 1. Validaciones previas: SSR, ID nulo o socket deshabilitado
    if (typeof window === "undefined" || !gpsDeviceId || !enabled) {
      return;
    }

    // 2. Importación dinámica de SockJS (necesaria en Next.js para evitar errores de 'window is undefined')
    import("sockjs-client").then((SockJSModule) => {
      const SockJS = SockJSModule.default;
      const SocketURL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3050/ws";

      // 3. Configuración del Cliente STOMP
      const client = new Client({
        webSocketFactory: () => new SockJS(SocketURL),
        reconnectDelay: 5000,
        debug: (str) => {
            // Puedes comentar esto en producción para limpiar la consola
            console.log("STOMP:", str)
        },
        
        onConnect: () => {
          console.log(`✅ Conectado a WebSocket (Dispositivo: ${gpsDeviceId})`);
          
          // Suscripción al canal específico
          client.subscribe(`/topic/gps/${gpsDeviceId}`, (msg: IMessage) => {
            if (msg.body) {
              try {
                const data: GpsTelemetria = JSON.parse(msg.body);
                // Usamos la referencia para llamar a la función más reciente
                onMessageRef.current(data);
              } catch (error) {
                console.error("Error parseando telemetría:", error);
              }
            }
          });
        },

        onStompError: (frame) => {
          console.error("❌ Error STOMP:", frame);
        },
      });

      // 4. Activar conexión
      stompClient.current = client;
      client.activate();
    });

    // 5. Cleanup: Se ejecuta al desmontar o cambiar de ID
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
        stompClient.current = null;
        console.log("❌ Desconectado de WebSocket");
      }
    };
  }, [gpsDeviceId, enabled]); // Quitamos 'onMessage' de aquí para evitar reconexiones infinitas
}