import { useEffect, useRef, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';

interface UseWebSocketProps {
  onMessage: (message: string) => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = ({ onMessage, onError }: UseWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  const connect = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      wsRef.current = new WebSocket(API_ENDPOINTS.wsProgress);

      wsRef.current.onopen = () => {
        console.log('WebSocket connection established');
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        onMessage(event.data);
      };

      wsRef.current.onerror = (error) => {
        if (onError) {
          onError(error);
        }
      };

      wsRef.current.onclose = () => {
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          setTimeout(connect, 1000 * Math.pow(2, reconnectAttempts.current));
        }
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
  }, [onMessage, onError]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return wsRef.current;
};