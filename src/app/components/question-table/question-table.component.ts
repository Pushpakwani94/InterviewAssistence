import { Component, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminStateService } from '../../services/admin-state.service';
import { SessionService } from '@shared/services/session.service';

@Component({
  selector: 'app-question-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-panel d-flex flex-column h-100">
      

      <!-- Table Header -->
      <div class="px-3 py-2 d-flex align-items-center text-muted-custom border-bottom border-dark-custom fw-bold" style="font-size:0.75rem;">
        <div style="width: 30px">#</div>
        <div class="flex-grow-1">Question</div>
      </div>

      <!-- Question List -->
      <div class="flex-grow-1 overflow-auto list-scroll">
        <div class="question-row px-2 px-md-3 py-2 py-md-3 d-flex align-items-center border-bottom border-dark-custom gap-2 gap-md-3" 
             *ngFor="let q of state.filteredQuestions(); let i = index"
             [class.active-row]="state.selectedQuestion()?.id === q.id"
             (click)="state.selectQuestion(q); sendDirectly(q)">
          
          <div style="width: 25px" class="text-secondary fs-7 text-center flex-shrink-0">{{ i + 1 }}</div>
          
          <!-- Icon Circle -->
          <div class="icon-circle d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" 
               [style.background]="getIconBg(i)">
            <i class="bi" [ngClass]="getIconClass(i)" [style.color]="getIconColor(i)" style="font-size: 1.1rem;"></i>
          </div>
          
          <div class="flex-grow-1 d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-1 gap-sm-2 text-truncate pe-1 pe-md-2">
            <div class="text-main text-truncate" style="font-size:0.9rem; font-weight: 500; white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              {{ q.title }}
            </div>
            <span class="badge border border-secondary text-secondary px-2 py-1 flex-shrink-0 mt-1 mt-sm-0" 
                  style="font-size: 0.65rem; font-weight: normal; background-color: rgba(255,255,255,0.03) !important;">
              {{ q.technology || 'Java' }}
            </span>
          </div>
          
          <div class="flex-shrink-0">
            <button class="btn btn-sm btn-send-custom px-2 px-sm-3 py-1 d-flex align-items-center gap-2" 
                    (click)="sendDirectly(q); $event.stopPropagation()">
              <i class="bi bi-send-fill" style="font-size: 0.8rem;"></i>
              <span class="d-none d-sm-inline">Send</span>
            </button>
          </div>
          
        </div>
      </div>



      <!-- Toolbar (Moved Below) -->
      <div class="p-2 p-md-3 border-top border-dark-custom d-flex gap-2 align-items-center search-toolbar">
        <div class="position-relative flex-grow-1 search-input-wrapper">
          <i class="bi bi-search position-absolute top-50 translate-middle-y text-secondary ms-3"></i>
          <input type="text" class="input-custom w-100 ps-5 pe-5 py-2" placeholder="Search questions..." style="font-size:0.85rem; border-radius: 8px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white;"
                 [ngModel]="state.searchQuery()" (ngModelChange)="state.setSearch($event)">
          <i class="bi position-absolute top-50 translate-middle-y end-0 me-3 cursor-pointer fs-5" 
             [ngClass]="isListening ? 'bi-mic-fill text-danger pulse-anim' : 'bi-mic text-secondary'"
             title="Voice Search & Auto-Send"
             (click)="toggleListening()"></i>
        </div>
        <button class="btn btn-outline-custom text-secondary px-3 d-none d-md-flex align-items-center gap-2" style="border-radius: 8px;"><i class="bi bi-funnel"></i> Filters</button>
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
    
    .btn-send-custom {
      border: 1px solid rgba(115, 165, 248, 0.3);
      background: rgba(115, 165, 248, 0.05);
      color: #73a5f8;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .btn-send-custom:hover {
      background: rgba(115, 165, 248, 0.15);
      color: #92bbf9;
      border-color: rgba(115, 165, 248, 0.5);
    }
    
    .icon-circle {
      width: 40px;
      height: 40px;
    }
    
    @media (max-width: 576px) {
      .icon-circle { width: 32px; height: 32px; }
      .icon-circle i { font-size: 0.9rem !important; }
      .btn-send-custom { padding: 0.3rem 0.6rem !important; }
      .btn-send-custom i { font-size: 0.9rem !important; }
      .btn-send-custom span { display: none; }
    }
    
    .question-row { transition: all 0.2s; cursor: pointer; }
    .question-row:hover { background: rgba(255,255,255,0.02); }
    .active-row { background: rgba(255,255,255,0.04) !important; }
    
    .fs-7 { font-size: 0.85rem; }
    
    .list-scroll { scrollbar-width: none; }
    .list-scroll::-webkit-scrollbar { display: none; }
    .pulse-anim { animation: pulse 1s infinite; }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .input-custom:focus {
      outline: none;
      border-color: rgba(115, 165, 248, 0.5) !important;
      box-shadow: 0 0 0 2px rgba(115, 165, 248, 0.2);
    }
  `]
})
export class QuestionTableComponent {
  state = inject(AdminStateService);
  sessionService = inject(SessionService);
  zone = inject(NgZone);
  cdr = inject(ChangeDetectorRef);
  
  isListening = false;
  recognition: any;

  // Icon mapping array based on the user's design
  private icons = [
    { class: 'bi-cup-hot', color: '#b28df8', bg: 'rgba(178, 141, 248, 0.15)' },
    { class: 'bi-layers', color: '#b28df8', bg: 'rgba(178, 141, 248, 0.15)' },
    { class: 'bi-code-slash', color: '#b28df8', bg: 'rgba(178, 141, 248, 0.15)' },
    { class: 'bi-lock', color: '#b28df8', bg: 'rgba(178, 141, 248, 0.15)' },
    { class: 'bi-diagram-2', color: '#b28df8', bg: 'rgba(178, 141, 248, 0.15)' },
    { class: 'bi-puzzle', color: '#b28df8', bg: 'rgba(178, 141, 248, 0.15)' },
    { class: 'bi-triangle', color: '#b28df8', bg: 'rgba(178, 141, 248, 0.15)' },
    { class: 'bi-box', color: '#b28df8', bg: 'rgba(178, 141, 248, 0.15)' }
  ];

  getIconClass(index: number): string {
    return this.icons[index % this.icons.length].class;
  }

  getIconBg(index: number): string {
    return this.icons[index % this.icons.length].bg;
  }

  getIconColor(index: number): string {
    return this.icons[index % this.icons.length].color;
  }

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
    this.sessionService.sendAnswer(payload);
  }
}
