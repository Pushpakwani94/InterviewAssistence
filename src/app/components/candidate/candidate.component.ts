import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '@shared/services/socket.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex flex-column" style="min-height: 100vh; padding-bottom: 80px;" [style.--text-scale]="textScale">
      
      <!-- Header -->
      <header class="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary" style="background: var(--bg-card);">
        <div class="d-flex align-items-center gap-2 position-relative">
          <i class="bi bi-list fs-3 cursor-pointer" (click)="showMenu = !showMenu"></i>
          
          <!-- Dropdown Menu -->
          <div *ngIf="showMenu" class="dropdown-menu show position-absolute shadow" style="top: 40px; left: 0; z-index: 1000; border: 1px solid var(--border-color); background: var(--bg-panel);">
            <a class="dropdown-item py-2 text-main cursor-pointer" (click)="increaseTextSize(); showMenu = false">
              <i class="bi bi-fonts me-2 text-primary"></i> Text Size
            </a>
            <a class="dropdown-item py-2 text-main cursor-pointer" (click)="copyAnswer(); showMenu = false" *ngIf="currentQuestion">
              <i class="bi bi-clipboard-check me-2 text-green"></i> Copy Answer
            </a>
            <a class="dropdown-item py-2 text-main cursor-pointer" (click)="toggleFullScreen(); showMenu = false">
              <i class="bi bi-arrows-fullscreen me-2 text-purple"></i> Full Screen
            </a>
          </div>

          <div>
            <h5 class="m-0 fw-bold" style="font-size: clamp(1rem, 4vw, 1.25rem);">Interview Assistant</h5>
            <small class="text-secondary d-none d-sm-block">Real-time answer delivery</small>
          </div>
        </div>
        <div class="d-flex gap-2 gap-sm-3 fs-4 align-items-center">
          <i class="bi bi-moon cursor-pointer"></i>
          <i class="bi bi-arrows-fullscreen cursor-pointer d-none d-sm-block"></i>
        </div>
      </header>

      <!-- Main Content -->
      <div class="p-3 flex-grow-1">
          <!-- Reconnecting Overlay -->
          <div *ngIf="connectionStatus === 'reconnecting'" class="alert border-warning text-warning bg-panel mb-3 d-flex align-items-center gap-2">
            <div class="spinner-border spinner-border-sm" role="status"></div>
            <span>Reconnecting to session...</span>
          </div>
          
          <ng-container *ngIf="currentQuestion; else waitingTpl">
          <!-- Navigation -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-secondary small">Question {{ currentIndex + 1 }} of {{ questionHistory.length }}</span>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-secondary" [disabled]="currentIndex <= 0" (click)="navigateHistory(-1)">
                <i class="bi bi-chevron-left"></i> Prev
              </button>
              <button class="btn btn-sm btn-outline-secondary" [disabled]="currentIndex >= questionHistory.length - 1" (click)="navigateHistory(1)">
                Next <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Question Card -->
          <div class="mobile-card question-card position-relative mt-2 fade-in">
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
            <!-- Emptied as requested -->
          </div>
        </ng-template>
      </div>

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
      background-color: rgba(0, 0, 0, 0.05);
    }
  `]
})
export class CandidateComponent implements OnInit, OnDestroy {
  textScale = 1;
  
  questionHistory: any[] = [];
  currentIndex = -1;
  currentQuestion: any = null;
  
  showMenu = false;
  private answerSub!: Subscription;

  constructor(
    private sessionService: SessionService, 
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeSession();
  }

  initializeSession() {
    this.sessionService.joinSession();

    // Fetch History
    this.sessionService.getHistory().subscribe({
      next: (history: any) => {
        if (history && history.length > 0) {
          this.questionHistory = history;
          this.currentIndex = history.length - 1;
          this.currentQuestion = this.questionHistory[this.currentIndex];
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => console.error('Failed to fetch history', err)
    });

    this.answerSub = this.sessionService.onReceiveAnswer().subscribe((data: any) => {
      if (!data) return; // Prevent crash when no question is active yet

      // Add to history if not duplicate (simple check)
      if (this.questionHistory.length === 0 || this.questionHistory[this.questionHistory.length - 1].question !== data.question) {
        this.questionHistory.push(data);
        // Auto-navigate to latest question when a new one arrives
        this.currentIndex = this.questionHistory.length - 1;
        this.currentQuestion = this.questionHistory[this.currentIndex];
        this.cdr.detectChanges();
      }
    });
  }

  navigateHistory(direction: number) {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.questionHistory.length) {
      this.currentIndex = newIndex;
      this.currentQuestion = this.questionHistory[this.currentIndex];
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.answerSub) {
      this.answerSub.unsubscribe();
    }
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
