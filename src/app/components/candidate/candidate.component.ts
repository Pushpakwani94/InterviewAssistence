import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '@shared/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex flex-column" style="min-height: 100vh; padding-bottom: 80px;" [style.--text-scale]="textScale">
      
      <!-- Header -->
      <header class="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary" style="background: var(--bg-card);">
        <div class="d-flex align-items-center gap-2 position-relative">
          <i class="bi bi-list fs-3 cursor-pointer" (click)="showMenu = !showMenu"></i>
          
          <!-- Dropdown Menu -->
          <div *ngIf="showMenu" class="dropdown-menu dropdown-menu-dark show position-absolute shadow" style="top: 40px; left: 0; z-index: 1000; border: 1px solid var(--border-color); background: var(--bg-panel);">
            <a class="dropdown-item py-2 text-light cursor-pointer" (click)="increaseTextSize(); showMenu = false">
              <i class="bi bi-fonts me-2 text-neon"></i> Text Size
            </a>
            <a class="dropdown-item py-2 text-light cursor-pointer" (click)="copyAnswer(); showMenu = false" *ngIf="currentQuestion">
              <i class="bi bi-clipboard-check me-2 text-green"></i> Copy Answer
            </a>
            <a class="dropdown-item py-2 text-light cursor-pointer" (click)="toggleFullScreen(); showMenu = false">
              <i class="bi bi-arrows-fullscreen me-2 text-purple"></i> Full Screen
            </a>
          </div>

          <div>
            <h5 class="m-0 fw-bold">Interview Assistant</h5>
            <small class="text-secondary">Real-time answer delivery</small>
          </div>
        </div>
        <div class="d-flex gap-3 fs-4 align-items-center">
          <span class="badge border border-neon text-neon px-2 py-1 me-1 fw-bold" style="font-size:0.8rem">
            {{ sessionCode }}
          </span>
          <i class="bi bi-moon cursor-pointer"></i>
          <i class="bi bi-arrows-fullscreen cursor-pointer"></i>
        </div>
      </header>

      <!-- Main Content -->
      <div class="p-3 flex-grow-1">
        


        <ng-container *ngIf="currentQuestion; else waitingTpl">
          <!-- Question Card -->
          <div class="mobile-card question-card position-relative mt-4 fade-in">
            <div class="d-flex align-items-baseline gap-2">
              <div class="text-neon fw-bold d-flex align-items-center gap-1" style="white-space: nowrap; font-size: 1rem;">
                <i class="bi bi-question-circle"></i>
                <span>QUESTION:</span>
              </div>
              <h2 class="text-huge m-0" style="font-size: 1.2rem;">{{ currentQuestion.question }}</h2>
            </div>
          </div>

          <!-- Answer Card -->
          <div class="mobile-card answer-card position-relative mt-3 fade-in" style="animation-delay: 0.1s;">
            <div class="d-flex align-items-center gap-2 mb-3 text-green fw-bold">
              <i class="bi bi-check-circle fs-5"></i>
              <span>ANSWER</span>
            </div>
            <p class="text-large m-0" style="white-space: pre-wrap;">{{ currentQuestion.answer }}</p>
          </div>

          <!-- Explanation Card -->
          <div class="mobile-card explanation-card position-relative mt-3 fade-in" style="animation-delay: 0.2s;" *ngIf="currentQuestion.explanation">
            <div class="d-flex align-items-center gap-2 mb-3 text-purple fw-bold">
              <i class="bi bi-lightbulb fs-5"></i>
              <span>EXPLANATION</span>
            </div>
            <p class="m-0 opacity-75" style="font-size: calc(1rem * var(--text-scale, 1))">
              {{ currentQuestion.explanation }}
            </p>
          </div>
        </ng-container>

        <ng-template #waitingTpl>
          <div class="text-center py-5 mt-5">
            <div class="spinner-border text-neon mb-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <h5 class="text-secondary">Waiting for the next question...</h5>
          </div>
        </ng-template>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#" class="nav-item active">
          <i class="bi bi-house-door-fill"></i>
          <span>Home</span>
        </a>
        <a href="#" class="nav-item">
          <i class="bi bi-clock-history"></i>
          <span>History</span>
        </a>
        <a href="#" class="nav-item">
          <i class="bi bi-gear"></i>
          <span>Settings</span>
        </a>
      </nav>

    </div>
  `,
  styles: [`
    .fade-in {
      animation: fadeIn 0.4s ease-out forwards;
      opacity: 0;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cursor-pointer { cursor: pointer; }
    .dropdown-item:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  `]
})
export class CandidateComponent implements OnInit, OnDestroy {
  textScale = 1;
  sessionCode = 'JAVA123'; // Mock code for now
  connected = false;
  currentQuestion: any = null;
  showMenu = false;
  private answerSub!: Subscription;

  constructor(private socketService: SocketService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.socketService.connect();
    this.socketService.joinSession(this.sessionCode);
    this.connected = true;

    this.answerSub = this.socketService.onReceiveAnswer().subscribe((data) => {
      this.currentQuestion = data;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.answerSub) {
      this.answerSub.unsubscribe();
    }
    this.socketService.disconnect();
  }

  increaseTextSize() {
    this.textScale = this.textScale >= 1.5 ? 1 : this.textScale + 0.25;
  }

  copyAnswer() {
    if (this.currentQuestion?.answer) {
      navigator.clipboard.writeText(this.currentQuestion.answer).then(() => {
        alert('Answer copied to clipboard!');
      });
    }
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}
