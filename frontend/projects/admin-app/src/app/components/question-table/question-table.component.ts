import { Component, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminStateService } from '../../services/admin-state.service';
import { SocketService } from '@shared/services/socket.service';

@Component({
  selector: 'app-question-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-panel d-flex flex-column h-100">
      
      <!-- Toolbar -->
      <div class="p-3 border-bottom border-dark-custom d-flex gap-2 align-items-center">
        <div class="position-relative flex-grow-1">
          <i class="bi bi-search position-absolute top-50 translate-middle-y text-secondary ms-3"></i>
          <input type="text" class="input-custom w-100 ps-5 pe-5" placeholder="Search all questions across all categories..." style="font-size:0.85rem"
                 [ngModel]="state.searchQuery()" (ngModelChange)="state.setSearch($event)">
          <i class="bi position-absolute top-50 translate-middle-y end-0 me-3 cursor-pointer fs-5" 
             [ngClass]="isListening ? 'bi-mic-fill text-danger pulse-anim' : 'bi-mic text-secondary'"
             title="Voice Search & Auto-Send"
             (click)="toggleListening()"></i>
        </div>
        <button class="btn btn-outline-custom text-secondary px-3"><i class="bi bi-funnel"></i> Filters</button>
        <button class="btn btn-outline-custom text-secondary px-3 d-flex align-items-center gap-2">Latest <i class="bi bi-chevron-down" style="font-size:0.7rem"></i></button>
        <button class="btn btn-outline-custom text-secondary px-2"><i class="bi bi-grid-3x3-gap"></i></button>
      </div>

      <!-- Table Header -->
      <div class="px-3 py-2 d-flex align-items-center text-muted-custom border-bottom border-dark-custom fw-bold" style="font-size:0.75rem;">
        <div style="width: 40px">#</div>
        <div class="flex-grow-1">Question</div>
        <div style="width: 100px" class="text-center">Difficulty</div>
        <div style="width: 80px" class="text-center">Actions</div>
      </div>

      <!-- Question List -->
      <div class="flex-grow-1 overflow-auto list-scroll">
        <div class="question-row px-3 py-3 d-flex align-items-center border-bottom border-dark-custom" 
             *ngFor="let q of state.filteredQuestions(); let i = index"
             [class.active-row]="state.selectedQuestion()?.id === q.id"
             (click)="state.selectQuestion(q)">
          
          <div style="width: 40px" class="text-secondary fs-7">{{ i + 1 }}</div>
          
          <div class="flex-grow-1 pe-2 text-main" style="font-size:0.85rem;">
            {{ q.title }}
          </div>
          
          <div style="width: 100px" class="text-center">
            <span class="badge-custom" [ngClass]="getDifficultyClass(q.difficulty)">{{ q.difficulty }}</span>
          </div>
          
          <div style="width: 80px" class="text-center d-flex justify-content-center gap-3 align-items-center">
            <i class="bi bi-send-fill text-primary-custom cursor-pointer hover-scale" 
               title="Send to Candidate" 
               (click)="sendDirectly(q); $event.stopPropagation()"></i>
            <i class="bi cursor-pointer" 
               [ngClass]="state.selectedQuestion()?.id === q.id ? 'bi-star-fill text-warning' : 'bi-star text-secondary'"></i>
          </div>

        </div>
      </div>

      <!-- Pagination -->
      <div class="p-3 border-top border-dark-custom d-flex justify-content-between align-items-center text-muted-custom" style="font-size:0.8rem">
        <div>Showing 1 to 10 of 98 questions</div>
        <div class="d-flex gap-1 pagination-controls">
          <button class="btn-page"><i class="bi bi-chevron-left"></i></button>
          <button class="btn-page active">1</button>
          <button class="btn-page">2</button>
          <button class="btn-page">3</button>
          <button class="btn-page disabled">...</button>
          <button class="btn-page">10</button>
          <button class="btn-page"><i class="bi bi-chevron-right"></i></button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .border-dark-custom { border-color: rgba(255,255,255,0.05) !important; }
    
    .btn-outline-custom {
      border: 1px solid rgba(255,255,255,0.1);
      background: transparent;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-outline-custom:hover { background: rgba(255,255,255,0.05); color: var(--text-main) !important; }
    
    .question-row { transition: all 0.2s; cursor: pointer; }
    .question-row:hover { background: rgba(255,255,255,0.02); }
    .active-row { background: rgba(255,255,255,0.04) !important; }
    
    .fs-7 { font-size: 0.85rem; }
    
    .btn-page {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      font-size: 0.8rem;
    }
    .btn-page:hover:not(.disabled):not(.active) { background: rgba(255,255,255,0.05); }
    .btn-page.active { background: var(--primary-blue); color: white; }
    .btn-page.disabled { opacity: 0.5; cursor: default; }

    .list-scroll { scrollbar-width: none; }
    .list-scroll::-webkit-scrollbar { display: none; }
    .text-primary-custom { color: var(--primary-blue); }
    .hover-scale { transition: transform 0.2s; }
    .hover-scale:hover { transform: scale(1.2); color: var(--accent-blue) !important; }
    .pulse-anim { animation: pulse 1s infinite; }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class QuestionTableComponent {
  state = inject(AdminStateService);
  socketService = inject(SocketService);
  zone = inject(NgZone);
  cdr = inject(ChangeDetectorRef);
  
  isListening = false;
  recognition: any;

  constructor() {
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        this.zone.run(() => {
          const transcript = event.results[0][0].transcript;
          console.log('Heard:', transcript);
          this.handleSpokenText(transcript);
        });
      };

      this.recognition.onerror = (event: any) => {
        this.zone.run(() => {
          console.error('Speech recognition error', event.error);
          this.isListening = false;
          this.cdr.detectChanges();
          if (event.error !== 'no-speech') {
             alert('Microphone error: ' + event.error);
          }
        });
      };

      this.recognition.onend = () => {
        this.zone.run(() => {
          this.isListening = false;
          this.cdr.detectChanges();
        });
      };
    }
  }

  toggleListening() {
    if (!this.recognition) {
      alert('Voice recognition is not supported in your browser. Please use Google Chrome or Edge.');
      return;
    }
    
    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
        this.isListening = true;
        this.cdr.detectChanges();
      } catch (e: any) {
        console.error('Start error', e);
        // If already started, it might throw
      }
    }
  }

  handleSpokenText(transcript: string) {
    this.state.setSearch(transcript);
    
    const questions = this.state.masterQuestionDB;
    
    // Filter out common stop words to focus on keywords
    const stopWords = ['what', 'is', 'the', 'how', 'do', 'you', 'to', 'in', 'of', 'and', 'a', 'an', 'are', 'tell', 'me', 'about', 'your'];
    const words = transcript.toLowerCase().replace(/[^\\w\\s]/g, '').split(' ')
                    .filter(w => w.length > 2 && !stopWords.includes(w));
    
    let bestMatch = null;
    let maxScore = 0;

    for (const q of questions) {
      const qTitle = q.title.toLowerCase();
      let score = 0;
      
      for (const w of words) {
        if (qTitle.includes(w)) score++;
      }
      
      // Massive bonus for exact phrase matching
      if (qTitle.includes(transcript.toLowerCase().trim())) {
         score += 10;
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = q;
      }
    }

    // If we found at least 1 significant keyword match, consider it a success
    if (bestMatch && maxScore > 0) {
      this.state.selectedQuestion.set(bestMatch);
      this.sendDirectly(bestMatch);
      console.log(`Voice auto-matched and sent: "${bestMatch.title}"`);
      // Optional: Clear search box after successful send so it's ready for next
      setTimeout(() => this.state.setSearch(''), 2000);
    } else {
      console.warn(`Heard: "${transcript}". No matching question found.`);
    }
  }

  getDifficultyClass(diff: string) {
    if (diff === 'Easy') return 'badge-success';
    if (diff === 'Medium') return 'badge-warning';
    return '';
  }

  sendDirectly(q: any) {
    const payload = {
      question: q.title,
      answer: q.answer,
      explanation: q.explanation,
      difficulty: q.difficulty
    };
    this.socketService.sendAnswer(this.state.sessionCode(), payload);
  }
}
