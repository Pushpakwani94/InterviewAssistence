import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private serverUrl = 'http://localhost:5000'; // Default dev backend URL

  constructor() {}

  connect(url?: string): void {
    if (url) {
      this.serverUrl = url;
    }
    this.socket = io(this.serverUrl);
  }

  joinSession(sessionCode: string): void {
    if (this.socket) {
      this.socket.emit('join_session', sessionCode);
      // Ensure we rejoin the session if the backend restarts or socket reconnects
      this.socket.on('connect', () => {
        this.socket.emit('join_session', sessionCode);
      });
    }
  }

  sendAnswer(sessionCode: string, answerData: any): void {
    if (this.socket) {
      this.socket.emit('send_answer', { sessionCode, answerData });
    }
  }

  onReceiveAnswer(): Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on('receive_answer', (data) => {
          observer.next(data);
        });
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
