import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private serverUrl = 'http://localhost:5000'; // Fallback local dev URL
  private currentSessionCode: string | null = null;

  constructor(private http: HttpClient) {
    // If running in browser and NOT on localhost, use the relative path so Vercel routing handles it
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      this.serverUrl = window.location.origin;
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
        return this.http.get<any>(`${this.serverUrl}/api/sessions/receive/${this.currentSessionCode}`);
      }),
      // We only want to emit when the data actually changes to avoid redundant UI updates.
      // We stringify it simply to detect distinct questions.
      distinctUntilChanged((prev, curr) => JSON.stringify(prev?.data) === JSON.stringify(curr?.data))
    );
  }

  disconnect(): void {
    this.currentSessionCode = null;
  }
}
