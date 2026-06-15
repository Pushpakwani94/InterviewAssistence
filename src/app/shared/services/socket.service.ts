import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private serverUrl = 'http://localhost:5000'; // Fallback local dev URL
  private currentSessionCode: string | null = null;
  private socket: Socket | null = null;
  private answerSubject = new Subject<any>();

  constructor(private http: HttpClient, private ngZone: NgZone) {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // If deployed to Vercel (or not local/IP), use the same origin without port
      if (hostname !== 'localhost' && !hostname.match(/^[0-9.]+$/)) {
        this.serverUrl = window.location.origin;
      } else {
        // If localhost or local network IP (e.g. 192.168.x.x), use port 5000
        this.serverUrl = `http://${hostname}:5000`;
      }
    }
  }

  connect(url?: string): void {
    if (url) {
      this.serverUrl = url;
    }
    if (!this.socket) {
      this.socket = io(this.serverUrl);
      this.socket.on('receive_answer', (data) => {
        this.ngZone.run(() => {
          this.answerSubject.next(data);
        });
      });
    }
  }

  joinSession(sessionCode: string): void {
    this.currentSessionCode = sessionCode;
    if (this.socket) {
      this.socket.emit('join_session', sessionCode);
      console.log(`Joined session via Socket.io: ${sessionCode}`);
    }
  }

  sendAnswer(sessionCode: string, answerData: any): void {
    if (this.socket) {
      this.socket.emit('send_answer', { sessionCode, answerData });
      console.log('Successfully sent answer to candidate via Socket.io');
    }
  }

  onReceiveAnswer(): Observable<any> {
    return this.answerSubject.asObservable();
  }

  disconnect(): void {
    this.currentSessionCode = null;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
