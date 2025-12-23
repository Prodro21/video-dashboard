import type { WSMessage, WSEventType } from '@/types'

type EventHandler<T = unknown> = (payload: T) => void

interface WebSocketServiceOptions {
  url?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

class WebSocketService {
  private ws: WebSocket | null = null
  private handlers: Map<WSEventType, Set<EventHandler>> = new Map()
  private reconnectAttempts = 0
  private reconnectTimeout: number | null = null
  private isConnecting = false
  private statusListeners: Set<(connected: boolean) => void> = new Set()

  private options: Required<WebSocketServiceOptions> = {
    url: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`,
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
  }

  constructor(options?: WebSocketServiceOptions) {
    if (options) {
      this.options = { ...this.options, ...options }
    }
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return
    }

    this.isConnecting = true

    try {
      this.ws = new WebSocket(this.options.url)

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.notifyStatusListeners(true)
      }

      this.ws.onclose = (event) => {
        console.log('[WebSocket] Disconnected:', event.code, event.reason)
        this.isConnecting = false
        this.notifyStatusListeners(false)
        this.scheduleReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error)
        this.isConnecting = false
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data)
          this.dispatch(message.type, message.payload)
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error)
        }
      }
    } catch (error) {
      console.error('[WebSocket] Failed to connect:', error)
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.reconnectAttempts = 0
    this.notifyStatusListeners(false)
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.log('[WebSocket] Max reconnect attempts reached')
      return
    }

    if (this.reconnectTimeout) {
      return
    }

    this.reconnectAttempts++
    console.log(`[WebSocket] Reconnecting in ${this.options.reconnectInterval}ms (attempt ${this.reconnectAttempts})`)

    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectTimeout = null
      this.connect()
    }, this.options.reconnectInterval)
  }

  on<T = unknown>(event: WSEventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }

    this.handlers.get(event)!.add(handler as EventHandler)

    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler as EventHandler)
    }
  }

  off(event: WSEventType, handler?: EventHandler): void {
    if (handler) {
      this.handlers.get(event)?.delete(handler)
    } else {
      this.handlers.delete(event)
    }
  }

  private dispatch(event: WSEventType, payload: unknown): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(payload)
        } catch (error) {
          console.error(`[WebSocket] Handler error for ${event}:`, error)
        }
      })
    }
  }

  onStatusChange(listener: (connected: boolean) => void): () => void {
    this.statusListeners.add(listener)
    return () => {
      this.statusListeners.delete(listener)
    }
  }

  private notifyStatusListeners(connected: boolean): void {
    this.statusListeners.forEach((listener) => listener(connected))
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const wsService = new WebSocketService()
