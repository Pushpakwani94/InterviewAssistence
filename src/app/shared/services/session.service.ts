import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, timer, Subscription, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {
  private answerSubject = new Subject<any>();
  public statsSubject = new BehaviorSubject<{ connectedCount?: number, questionsSentCount?: number }>({});

  private pollingSub: Subscription | null = null;

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  joinSession(): void {
    console.log(`Started global HTTP polling...`);
    this.stopPolling();
    this.ngZone.runOutsideAngular(() => {
      this.pollingSub = timer(0, 2500).pipe(
        switchMap(() => this.http.get<any>(`/api/sessions/global/current`).pipe(
          catchError(() => of(null))
        ))
      ).subscribe((data) => {
        if (data) {
          this.ngZone.run(() => {
            this.answerSubject.next(data);
          });
        }
      });
    });
  }

  sendAnswer(answerData: any): void {
    this.http.post(`/api/sessions/global/send`, { answerData }).subscribe({
      next: () => console.log('Successfully sent answer to candidate'),
      error: (err) => console.error('Failed to send answer', err)
    });
  }

  onReceiveAnswer(): Observable<any> {
    return this.answerSubject.asObservable();
  }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`/api/sessions/global/history`).pipe(
      catchError(() => of([]))
    );
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`/api/sessions/global/stats`).pipe(
      catchError(() => of({}))
    );
  }

  private stopPolling() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = null;
    }
  }

  ngOnDestroy() {
    this.stopPolling();
  }
}
