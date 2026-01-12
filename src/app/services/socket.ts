import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '@app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor(private authService: AuthService) {
    
    const token = this.authService.token;
    this.socket = io(environment.API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: { token }
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
  }

  /**
   * Desconecta el socket
   */
  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
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
