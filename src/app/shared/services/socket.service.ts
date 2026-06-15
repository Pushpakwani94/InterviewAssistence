import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // Use root path so Socket.io automatically resolves to the current origin (e.g. window.location.origin)
  // The Angular proxy will forward this to the backend in development, and it works natively in production.
  private serverUrl = ''; 
  private currentSessionCode: string | null = null;
  private socket: Socket | null = null;
  private answerSubject = new Subject<any>();
  
  public connectionStatus$ = new BehaviorSubject<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  public statsSubject = new BehaviorSubject<{ connectedCount?: number, questionsSentCount?: number }>({});

  constructor(private http: HttpClient, private ngZone: NgZone) {
    // No longer need to guess the server URL based on hostname, proxy handles it.
  }

  connect(url?: string): void {
    if (url) {
      this.serverUrl = url;
    }
    if (!this.socket) {
      this.socket = io(this.serverUrl, {
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      this.socket.on('connect', () => {
        this.ngZone.run(() => this.connectionStatus$.next('connected'));
      });

      this.socket.on('disconnect', () => {
        this.ngZone.run(() => this.connectionStatus$.next('disconnected'));
      });

      this.socket.on('connect_error', () => {
        this.ngZone.run(() => this.connectionStatus$.next('reconnecting'));
      });

      this.socket.on('stats_update', (data) => {
        this.ngZone.run(() => {
          const currentStats = this.statsSubject.value;
          this.statsSubject.next({ ...currentStats, ...data });
        });
      });

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

  getHistory(sessionCode: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/sessions/${sessionCode}/history`);
  }

  getStats(sessionCode: string): Observable<any> {
    return this.http.get<any>(`/api/sessions/${sessionCode}/stats`);
  }

  disconnect(): void {
    this.currentSessionCode = null;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
