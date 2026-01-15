import { BehaviorSubject, Observable } from 'rxjs'; 
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AuthService } from '@app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private readonly reconnectIntervalTime = 60000;

  private reconnectIntervalId: any;
  private readonly socket: Socket;
  private readonly isConnected$: BehaviorSubject<boolean>;
  private readonly connecting$: BehaviorSubject<boolean>;

  connectedSocket$(): Observable<boolean> {
    return this.isConnected$.asObservable();
  }

  connectingSocket$(): Observable<boolean> {
    return this.connecting$.asObservable();
  }

  constructor(private readonly authService: AuthService) {
    this.isConnected$ = new BehaviorSubject<boolean>(true);
    this.connecting$ = new BehaviorSubject<boolean>(false);
    
    const token = this.authService.token;
    this.socket = io(environment.API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: { token }
    });

    this.socket.on('connect', () => {
      this.isConnected$.next(true);
      this.connecting$.next(false);
      if (this.reconnectIntervalId) {
        clearInterval(this.reconnectIntervalId);
        this.reconnectIntervalId = null;
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected$.next(false);
      if (!this.reconnectIntervalId) {
        this.reconnectIntervalId = setInterval(() => {
          if (!this.socket.connected) {
            this.connect();
          }
        }, this.reconnectIntervalTime);
      }
    });


    this.socket.io.on('reconnect_attempt', () => {
      console.log('Reconnecting attempt...');
      this.connecting$.next(true);
    });

    this.socket.io.on('reconnect_failed', () => {
      console.log('Reconnection failed.');
      this.isConnected$.next(false);
      this.connecting$.next(false);
      if (!this.reconnectIntervalId) {
        this.reconnectIntervalId = setInterval(() => {
          if (!this.socket.connected) {
            this.connect();
          }
        }, this.reconnectIntervalTime);
      }
    });

    this.authService.isLoged().subscribe(loged => {
      if (loged) {
        this.connect();
      }
    });
  }

  /**
   * Escucha eventos del servidor y devuelve un Observable
   */
  fromEvent<T>(eventName: string): Observable<T> {
    return new Observable<T>(observer => {
      this.socket.on(eventName, (data: T) => {
        observer.next(data);
      });

      // Cleanup cuando se desuscribe
      return () => {
        this.socket.off(eventName);
      };
    });
  }

  /**
   * Emite un evento al servidor
   */
  emit(eventName: string, data?: any): void {
    this.socket.emit(eventName, data);
  }

  /**
   * Emite un evento y espera respuesta (callback)
   */
  emitWithCallback(eventName: string, data?: any, callback?: (response: any) => void): void {
    if (callback) {
      this.socket.emit(eventName, data, callback);
    } else {
      this.socket.emit(eventName, data);
    }
  }

  /**
   * Conecta manualmente el socket
   */
  connect(): void {
    if (!this.socket.connected) {
      this.socket.auth = { token: this.authService.token };
      this.socket.connect();
    }
    // Si conecta manualmente, actualizar el estado
    if (this.socket.connected) {
      this.isConnected$.next(true);
    }
  }

  /**
   * Desconecta el socket
   */
  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
    this.isConnected$.next(false);
  }

  /**
   * Retorna true si está conectado
   */
  isConnected(): boolean {
    return this.socket.connected;
  }

  /**
   * Obtiene el ID del socket
   */
  getId(): string {
    return this.socket.id || '';
  }
}
