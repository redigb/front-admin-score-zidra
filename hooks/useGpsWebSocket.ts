// hooks/useGpsWebSocket.ts
"use client";

import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { GpsTelemetria } from "@/interface/telemetria-dispostivo";

export function useGpsWebSocket(
    gpsDeviceId: number | null,
    onMessage: (telemetria: GpsTelemetria) => void,
    enabled: boolean
) {
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        // 🔥 Salir temprano si no está en el navegador
        if (typeof window === 'undefined') return;
        if (!gpsDeviceId || !enabled) return;

        // 🔥 Importar SockJS dinámicamente solo cuando se necesita
        import('sockjs-client').then((SockJSModule) => {
            const SockJS = SockJSModule.default;
            const SocketURL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3050/ws";
            const socket = new SockJS(SocketURL);
            
            const client = new Client({
                webSocketFactory: () => socket as any,
                reconnectDelay: 5000,
                debug: (str) => console.log("STOMP:", str),
                onConnect: () => {
                    console.log("✅ Conectado a WebSocket");

                    client.subscribe(`/topic/gps/${gpsDeviceId}`, (msg: IMessage) => {
                        if (msg.body) {
                            const data: GpsTelemetria = JSON.parse(msg.body);
                            onMessage(data);
                        }
                    });
                },
                onStompError: (frame) => {
                    console.error("❌ Error STOMP:", frame);
                },
            });

            stompClient.current = client;
            client.activate();
        });

        // Cleanup
        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
                console.log("❌ Desconectado de WebSocket");
            }
        };
    }, [gpsDeviceId, enabled, onMessage]);
}