import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, distinctUntilChanged, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private serverUrl = 'http://localhost:5000'; // Fallback local dev URL
  private currentSessionCode: string | null = null;

  constructor(private http: HttpClient) {
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
  }

  joinSession(sessionCode: string): void {
    this.currentSessionCode = sessionCode;
    console.log(`Joined session for polling: ${sessionCode}`);
  }

  sendAnswer(sessionCode: string, answerData: any): void {
    this.http.post(`${this.serverUrl}/api/sessions/send`, { sessionCode, answerData }).subscribe({
      next: () => console.log('Successfully sent answer to candidate'),
      error: (err) => console.error('Error sending answer:', err)
    });
  }

  onReceiveAnswer(): Observable<any> {
    // Poll every 2 seconds
    return timer(0, 2000).pipe(
      switchMap(() => {
        if (!this.currentSessionCode) {
          return [null];
        }
        return this.http.get<any>(`${this.serverUrl}/api/sessions/receive/${this.currentSessionCode}`).pipe(
          // Extract the nested .data property returned by the Express backend
          map(res => res?.data || null),
          // If the network request fails (e.g., server down), catch the error so timer doesn't stop
          catchError(err => {
            console.error('Polling error:', err);
            return [null];
          })
        );
      }),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    );
  }

  disconnect(): void {
    this.currentSessionCode = null;
  }
}
