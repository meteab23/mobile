"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type MessageHandler = (msg: { type: string; data: unknown }) => void;

export function useWebSocket(onMessage: MessageHandler) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3001";
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        reconnectTimer = setTimeout(connect, 3000);
      };
      ws.onerror = () => ws.close();
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          onMessageRef.current(msg);
        } catch {
          /* ignore */
        }
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);

  const subscribe = useCallback((tickers: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "subscribe", tickers }));
    } else {
      const interval = setInterval(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ action: "subscribe", tickers }));
          clearInterval(interval);
        }
      }, 500);
    }
  }, []);

  return { connected, subscribe };
}
