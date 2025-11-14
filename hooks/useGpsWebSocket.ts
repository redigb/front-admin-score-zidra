// hooks/useGpsWebSocket.ts
"use client";

import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs"; // 👈 usa la nueva librería
import { GpsTelemetria } from "@/interface/telemetria-dispostivo";

export function useGpsWebSocket(
    gpsDeviceId: number | null,
    onMessage: (telemetria: GpsTelemetria) => void,
    enabled: boolean
) {
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        if (!gpsDeviceId || !enabled) return;
        const SocketURL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3050/ws";
        const socket = new SockJS(SocketURL); // URL backend
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // reconectar cada 5s si se corta
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
        });

        stompClient.current = client;
        client.activate();

        return () => {
            stompClient.current?.deactivate();
            console.log("❌ Desconectado de WebSocket");
        };
    }, [gpsDeviceId, enabled, onMessage]);
}
