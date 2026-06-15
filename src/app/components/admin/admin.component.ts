import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '@shared/services/socket.service';
import { AdminStateService } from '../../services/admin-state.service';
import { Subject } from 'rxjs';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { DashboardStatsComponent } from '../dashboard-stats/dashboard-stats.component';
import { CategoryListComponent } from '../category-list/category-list.component';
import { QuestionTableComponent } from '../question-table/question-table.component';
import { QuestionDetailComponent } from '../question-detail/question-detail.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent, 
    NavbarComponent, 
    CategoryListComponent, 
    QuestionTableComponent, 
    QuestionDetailComponent
  ],
  template: `
    <div class="app-layout position-relative">
      
      <!-- Mobile Sidebar Backdrop -->
      <div class="sidebar-backdrop d-md-none" 
           *ngIf="state.isMobileSidebarOpen()"
           (click)="state.toggleMobileSidebar()"></div>

      <div class="sidebar-wrapper" [class.mobile-open]="state.isMobileSidebarOpen()">
        <app-sidebar></app-sidebar>
      </div>
      
      <div class="main-content">
        <app-navbar></app-navbar>
        
        <div class="content-body">
          
          <ng-container *ngIf="!state.isManualEntryMode()">
            <!-- Three Column Layout -->
            <div class="row flex-grow-1 overflow-hidden mt-3 mx-0">
              <!-- Category List (Hidden on Mobile) -->
              <div class="col-md-2 h-100 p-0 pe-2 d-none d-md-block">
                <app-category-list class="d-block h-100"></app-category-list>
              </div>
              
              <!-- Question Table (Hidden on Mobile when detail is open) -->
              <div class="h-100 p-0 px-md-2 transition-width" 
                   [ngClass]="state.isDetailPanelOpen() ? 'd-none d-md-block col-md-5' : 'col-12 col-md-10'">
                <app-question-table class="d-block h-100"></app-question-table>
              </div>
              
              <!-- Question Detail -->
              <div class="col-12 col-md-5 h-100 p-0 ps-md-2" *ngIf="state.isDetailPanelOpen()">
                <app-question-detail class="d-block h-100"></app-question-detail>
              </div>
            </div>
          </ng-container>
          
          <!-- Custom Send Tab View -->
          <ng-container *ngIf="state.isManualEntryMode()">
            <div class="flex-grow-1 p-4 overflow-auto fade-in bg-panel mt-3 mx-3 rounded border border-secondary">
              <div class="mb-4 border-bottom border-secondary pb-3">
                <h4 class="m-0 text-light"><i class="bi bi-pencil-square me-2 text-neon"></i> Custom Send (Help)</h4>
                <p class="text-secondary mt-1 mb-0 small">Manually send custom questions and answers to the candidate.</p>
              </div>
              
              <div class="row">
                <div class="col-md-8 col-lg-6">
                  <div class="mb-3">
                    <label class="form-label text-secondary small text-uppercase">Question</label>
                    <input type="text" class="form-control input-custom" [(ngModel)]="customQuestion" placeholder="Enter custom question...">
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label text-secondary small text-uppercase">Answer</label>
                    <textarea class="form-control input-custom" rows="8" [(ngModel)]="customAnswer" placeholder="Enter detailed answer..."></textarea>
                  </div>
                  
                  <div class="mb-4">
                    <label class="form-label text-secondary small text-uppercase">Code Snippet (Optional)</label>
                    <textarea class="form-control input-custom text-monospace" rows="6" [(ngModel)]="customCode" placeholder="Enter code snippet..." style="font-family: monospace;"></textarea>
                  </div>
                  
                  <div class="d-flex gap-3">
                    <button class="btn btn-primary-custom px-4" [disabled]="!customQuestion || !customAnswer" (click)="sendCustom()">
                      <i class="bi bi-send-fill me-2"></i> Send to Candidate
                    </button>
                    <button class="btn btn-outline-secondary px-4" (click)="state.setManualEntryMode(false)">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
      
      <!-- Toast Notification -->
      <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
        <div id="liveToast" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" [class.show]="showToast" [class.hide]="!showToast" style="transition: opacity 0.3s; opacity: {{ showToast ? '1' : '0' }}">
          <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
              <i class="bi bi-check-circle-fill"></i> Question sent to candidates!
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="showToast = false" aria-label="Close"></button>
          </div>
        </div>
      </div>
      
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .transition-width { transition: width 0.3s ease-in-out; }

    /* Mobile Sidebar Styles */
    .sidebar-wrapper {
      height: 100vh;
      z-index: 1040;
      transition: transform 0.3s ease-in-out;
    }
    .sidebar-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.5);
      z-index: 1030;
      animation: fadeIn 0.3s ease-out;
    }
    
    @media (max-width: 767.98px) {
      .sidebar-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        transform: translateX(-100%);
        box-shadow: 4px 0 15px rgba(0,0,0,0.5);
      }
      .sidebar-wrapper.mobile-open {
        transform: translateX(0);
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  state = inject(AdminStateService);
  
  customQuestion = '';
  customAnswer = '';
  customCode = '';
  showToast = false;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.connect();
    
    // Listen for any answer sent from anywhere (like QuestionTable)
    const originalSend = this.socketService.sendAnswer.bind(this.socketService);
    this.socketService.sendAnswer = (sessionCode: string, payload: any) => {
      originalSend(sessionCode, payload);
      this.triggerToast();
    };
  }
  
  triggerToast() {
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  sendCustom() {
    if (!this.customQuestion || !this.customAnswer) return;

    let finalAnswer = this.customAnswer;
    if (this.customCode) {
      finalAnswer += '\n\nCode Example:\n' + this.customCode;
    }

    this.socketService.sendAnswer(this.state.sessionCode(), {
      question: this.customQuestion,
      answer: finalAnswer,
      explanation: 'Custom Help Sent by Admin',
      difficulty: 'Custom'
    });

    // Clear form and switch back to question bank
    this.customQuestion = '';
    this.customAnswer = '';
    this.customCode = '';
    this.state.setManualEntryMode(false);
  }
}
