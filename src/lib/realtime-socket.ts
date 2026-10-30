import { io, type Socket } from 'socket.io-client'

function getApiBaseUrl(): string {
  return import.meta.env?.VITE_API_URL ?? 'http://localhost:5000'
}

let socket: Socket | null = null

/**
 * @description Shared Socket.IO client (cookie session auth).
 */
export function getRealtimeSocket(): Socket {
  if (!socket) {
    socket = io(getApiBaseUrl(), {
      withCredentials: true,
      autoConnect: false,
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}

/**
 * @description Opens the socket connection when the user is authenticated.
 */
export function connectRealtimeSocket(): Socket {
  const instance = getRealtimeSocket()
  if (!instance.connected) {
    instance.connect()
  }
  return instance
}

/**
 * @description Closes the socket when the session ends.
 */
export function disconnectRealtimeSocket(): void {
  if (socket?.connected) {
    socket.disconnect()
  }
}
