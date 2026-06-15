import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStateService } from '../../services/admin-state.service';
import { SessionService } from '@shared/services/session.service';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel d-flex flex-column h-100 position-relative" *ngIf="state.selectedQuestion() as q; else noSelectTpl">
      
      <!-- Header -->
      <div class="p-3 border-bottom border-dark-custom d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-chevron-left cursor-pointer hover-text-main d-md-none text-secondary fs-5" (click)="state.isDetailPanelOpen.set(false)"></i>
          <h6 class="m-0 text-main fw-bold">Question Details</h6>
        </div>
        <div class="d-flex gap-3 text-secondary fs-6">
          <i class="bi bi-arrows-fullscreen cursor-pointer hover-text-main d-none d-md-block"></i>
          <i class="bi bi-x-lg cursor-pointer hover-text-main d-none d-md-block" (click)="state.isDetailPanelOpen.set(false)" title="Close Panel"></i>
        </div>
      </div>

      <div class="flex-grow-1 overflow-auto p-3 p-md-4 detail-scroll">
        
        <!-- Title Section -->
        <div class="mb-3">
          <div class="text-accent-blue fw-bold mb-2" style="font-size:0.75rem">Question</div>
          <div class="d-flex justify-content-between align-items-start gap-3">
            <h5 class="text-main fw-bold lh-base m-0">{{ q.title }}</h5>
            <div class="d-flex gap-2">
              <i class="bi bi-copy text-secondary cursor-pointer hover-text-main" style="font-size:0.9rem"></i>
              <i class="bi bi-bookmark text-primary-custom cursor-pointer fs-5" style="margin-top:-3px"></i>
            </div>
          </div>
        </div>

        <!-- Answer Section -->
        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <div class="text-success fw-bold" style="font-size:0.75rem">Answer</div>
            <i class="bi bi-volume-up text-success fs-5 cursor-pointer"></i>
          </div>
          <p class="text-secondary" style="font-size:0.85rem; line-height: 1.6; white-space: pre-wrap;">{{ q.answer }}</p>
        </div>


        <!-- Code Example -->
        <div class="mb-4" *ngIf="q.example">
          <div class="text-warning fw-bold mb-2" style="font-size:0.75rem">Example</div>
          <div class="code-block position-relative rounded p-3">
            <i class="bi bi-copy position-absolute top-0 end-0 m-2 text-secondary cursor-pointer hover-text-main"></i>
            <pre class="m-0" style="font-size:0.8rem; font-family: 'Courier New', Courier, monospace; color: #1E293B; white-space: pre-wrap">{{ q.example }}</pre>
          </div>
        </div>

        <!-- Keywords -->
        <div class="mb-4" *ngIf="q.keywords && q.keywords.length">
          <div class="text-accent-blue fw-bold mb-2" style="font-size:0.75rem">Keywords</div>
          <div class="d-flex flex-wrap gap-2">
            <span class="keyword-chip" *ngFor="let kw of q.keywords">{{ kw }}</span>
          </div>
        </div>

        <!-- Primary Action -->
        <button class="btn-primary-custom w-100 py-2 fs-6 mb-3 d-flex justify-content-center align-items-center gap-2 shadow-primary" (click)="sendToCandidate(q)">
          <i class="bi bi-send-fill"></i> Send To Candidate
        </button>

        <!-- Secondary Actions -->
        <div class="d-flex gap-2 mb-2">
          <button class="btn btn-outline-custom flex-grow-1 text-secondary" style="font-size:0.8rem">
            <i class="bi bi-clipboard"></i> Copy Answer
          </button>
          <button class="btn btn-outline-custom flex-grow-1 text-secondary" style="font-size:0.8rem">
            <i class="bi bi-pencil"></i> Edit Question
          </button>
          <button class="btn btn-outline-danger-custom" style="font-size:0.8rem">
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>

      </div>

      <!-- Footer -->
      <div class="p-3 border-top border-dark-custom d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2 text-purple" style="font-size:0.85rem">
          <i class="bi bi-diagram-3"></i> Related Questions
        </div>
        <button class="btn btn-sm btn-outline-custom text-secondary" style="font-size:0.75rem">View All (6)</button>
      </div>

    </div>

    <ng-template #noSelectTpl>
      <div class="glass-panel d-flex flex-column h-100 position-relative justify-content-center align-items-center">
        <button class="btn btn-link text-secondary position-absolute top-0 end-0 m-2 fs-5 hover-text-main" (click)="state.isDetailPanelOpen.set(false)" title="Close Panel">
          <i class="bi bi-x-lg"></i>
        </button>
        <i class="bi bi-journal-x text-muted-custom fs-1 mb-3"></i>
        <h6 class="text-secondary">Select a question to view details</h6>
      </div>
    </ng-template>
  `,
  styles: [`
    .border-dark-custom { border-color: rgba(0,0,0,0.05) !important; }
    .text-accent-blue { color: var(--accent-blue); }
    .text-primary-custom { color: var(--primary-blue); }
    .text-purple { color: var(--purple); }
    
    .hover-text-main:hover { color: var(--text-main) !important; }
    
    .code-block {
      background: #F8FAFC;
      border: 1px solid rgba(0,0,0,0.05);
    }
    
    .keyword-chip {
      padding: 4px 12px;
      background: rgba(0,0,0,0.03);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: 4px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .shadow-primary {
      box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
    }
    
    .btn-outline-custom {
      border: 1px solid rgba(0,0,0,0.1);
      background: rgba(0,0,0,0.02);
      transition: all 0.2s;
    }
    .btn-outline-custom:hover { background: rgba(0,0,0,0.05); color: var(--text-main) !important; }
    
    .btn-outline-danger-custom {
      border: 1px solid rgba(239, 68, 68, 0.2);
      background: rgba(239, 68, 68, 0.05);
      color: var(--danger);
      transition: all 0.2s;
    }
    .btn-outline-danger-custom:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger);
    }

    .detail-scroll { scrollbar-width: none; }
    .detail-scroll::-webkit-scrollbar { display: none; }
  `]
})
export class QuestionDetailComponent {
  state = inject(AdminStateService);
  sessionService = inject(SessionService);

  sendToCandidate(q: any) {
    const payload = {
      question: q.title,
      answer: q.answer,
      explanation: q.explanation,
      difficulty: q.difficulty
    };
    this.sessionService.sendAnswer(payload);
  }
}
