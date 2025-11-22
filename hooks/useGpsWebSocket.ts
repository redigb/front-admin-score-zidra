"use client";

import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { GpsTelemetria } from "@/interface/telemetria-dispostivo";

export function useGpsWebSocket(
    gpsDeviceId: number | null,
    onMessage: (telemetria: GpsTelemetria) => void,
    enabled: boolean
) {
    const stompClientRef = useRef<Client | null>(null);
    const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
    const onMessageRef = useRef(onMessage);

    // Mantiene onMessage estable
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!enabled || !gpsDeviceId || typeof window === "undefined") {
            // Si no hay ID o no está habilitado, desconectar.
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
            return;
        }

        let isMounted = true;

        const connect = async () => {
            if (!isMounted) return;

            const SockJS = (await import("sockjs-client")).default;
            const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3050/ws";

            const socket = new SockJS(url);

            const client = new Client({
                webSocketFactory: () => socket as any,

                // Heartbeat (algunos servers requieren esto)
                heartbeatIncoming: 10000,
                heartbeatOutgoing: 10000,

                debug: (msg) => console.log("STOMP:", msg),

                onConnect: () => {
                    if (!isMounted) return;

                    console.log("✅ Conectado al WebSocket");

                    client.subscribe(`/topic/gps/${gpsDeviceId}`, (msg: IMessage) => {
                        if (msg.body) {
                            try {
                                const data = JSON.parse(msg.body);
                                onMessageRef.current(data);
                            } catch (e) {
                                console.error("❌ Error parseando JSON:", e);
                            }
                        }
                    });
                },

                onStompError: (err) => {
                    console.error("❌ Error STOMP:", err);
                },

                onWebSocketClose: () => {
                    if (!isMounted) return;

                    console.log("⚠ WebSocket cerrado: reintentando en 3s…");

                    if (reconnectTimer.current) {
                        clearTimeout(reconnectTimer.current);
                    }

                    reconnectTimer.current = setTimeout(() => {
                        connect();
                    }, 3000);
                }
            });

            stompClientRef.current = client;
            client.activate();
        };

        connect();

        return () => {
            isMounted = false;

            console.log("🧹 Limpiando WebSocket...");

            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
            }

            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [gpsDeviceId, enabled]);
}
