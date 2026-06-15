import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../shared/services/session.service';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-3 mb-2">
      <!-- Total Questions -->
      <div class="col">
        <div class="stat-card p-3 d-flex flex-column h-100 position-relative overflow-hidden" style="--accent: var(--primary-blue)">
          <div class="icon-bg position-absolute"><i class="bi bi-book"></i></div>
          <div class="d-flex align-items-center gap-2 mb-2 z-index-1">
            <div class="stat-icon bg-icon-primary text-primary-custom d-flex justify-content-center align-items-center rounded"><i class="bi bi-book"></i></div>
            <span class="text-secondary" style="font-size:0.8rem; font-weight:500">Total Questions</span>
          </div>
          <h4 class="m-0 fw-bold z-index-1 text-main">25,368</h4>
          <div class="mt-auto pt-2 z-index-1">
            <small class="text-success" style="font-size:0.7rem;"><i class="bi bi-arrow-up-short"></i> 12.5% this month</small>
          </div>
        </div>
      </div>

      <!-- Technologies -->
      <div class="col">
        <div class="stat-card p-3 d-flex flex-column h-100 position-relative overflow-hidden" style="--accent: var(--success)">
          <div class="icon-bg position-absolute"><i class="bi bi-grid-1x2"></i></div>
          <div class="d-flex align-items-center gap-2 mb-2 z-index-1">
            <div class="stat-icon bg-icon-success text-success-custom d-flex justify-content-center align-items-center rounded"><i class="bi bi-grid-1x2"></i></div>
            <span class="text-secondary" style="font-size:0.8rem; font-weight:500">Technologies</span>
          </div>
          <h4 class="m-0 fw-bold z-index-1 text-main">35</h4>
          <div class="mt-auto pt-2 z-index-1">
            <small class="text-secondary" style="font-size:0.7rem;">Total technologies</small>
          </div>
        </div>
      </div>

      <!-- Active Sessions -->
      <div class="col">
        <div class="stat-card p-3 d-flex flex-column h-100 position-relative overflow-hidden" style="--accent: var(--purple)">
          <div class="icon-bg position-absolute"><i class="bi bi-people"></i></div>
          <div class="d-flex align-items-center gap-2 mb-2 z-index-1">
            <div class="stat-icon bg-icon-purple text-purple d-flex justify-content-center align-items-center rounded"><i class="bi bi-people"></i></div>
            <span class="text-secondary" style="font-size:0.8rem; font-weight:500">Active Sessions</span>
          </div>
          <h4 class="m-0 fw-bold z-index-1 text-main">24</h4>
          <div class="mt-auto pt-2 z-index-1">
            <small class="text-secondary" style="font-size:0.7rem;">Live interviews</small>
          </div>
        </div>
      </div>

      <!-- Connected Candidates -->
      <div class="col">
        <div class="stat-card p-3 d-flex flex-column h-100 position-relative overflow-hidden" style="--accent: var(--warning)">
          <div class="icon-bg position-absolute"><i class="bi bi-person-badge"></i></div>
          <div class="d-flex align-items-center gap-2 mb-2 z-index-1">
            <div class="stat-icon bg-icon-warning text-warning-custom d-flex justify-content-center align-items-center rounded"><i class="bi bi-person-badge"></i></div>
            <span class="text-secondary" style="font-size:0.8rem; font-weight:500">Connected Candidates</span>
          </div>
          <h4 class="m-0 fw-bold z-index-1 text-main">{{ stats.connectedCount || 0 }}</h4>
          <div class="mt-auto pt-2 z-index-1">
            <small class="text-warning" style="font-size:0.7rem;">Online now</small>
          </div>
        </div>
      </div>

      <!-- Today's Searches -->
      <div class="col">
        <div class="stat-card p-3 d-flex flex-column h-100 position-relative overflow-hidden" style="--accent: #06B6D4">
          <div class="icon-bg position-absolute"><i class="bi bi-graph-up"></i></div>
          <div class="d-flex align-items-center gap-2 mb-2 z-index-1">
            <div class="stat-icon bg-icon-cyan text-cyan d-flex justify-content-center align-items-center rounded"><i class="bi bi-send-fill"></i></div>
            <span class="text-secondary" style="font-size:0.8rem; font-weight:500">Questions Sent</span>
          </div>
          <h4 class="m-0 fw-bold z-index-1 text-main">{{ stats.questionsSentCount || 0 }}</h4>
          <div class="mt-auto pt-2 z-index-1">
            <small class="text-success" style="font-size:0.7rem;"><i class="bi bi-arrow-up-short"></i> 18.7% this month</small>
          </div>
        </div>
      </div>

      <!-- Favorite Questions -->
      <div class="col">
        <div class="stat-card p-3 d-flex flex-column h-100 position-relative overflow-hidden" style="--accent: #EC4899">
          <div class="icon-bg position-absolute"><i class="bi bi-heart"></i></div>
          <div class="d-flex align-items-center gap-2 mb-2 z-index-1">
            <div class="stat-icon bg-icon-pink text-pink d-flex justify-content-center align-items-center rounded"><i class="bi bi-heart"></i></div>
            <span class="text-secondary" style="font-size:0.8rem; font-weight:500">Favorite Questions</span>
          </div>
          <h4 class="m-0 fw-bold z-index-1 text-main">184</h4>
          <div class="mt-auto pt-2 z-index-1">
            <small class="text-secondary" style="font-size:0.7rem;">Total favorites</small>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .stat-card {
      background: rgba(255, 255, 255, 0.4);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: 12px;
      transition: all 0.2s;
    }
    .stat-card:hover {
      background: rgba(255, 255, 255, 0.8);
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    
    .z-index-1 { z-index: 1; }
    .icon-bg {
      right: -10px;
      bottom: -15px;
      font-size: 5rem;
      opacity: 0.03;
      color: var(--accent);
      z-index: 0;
      transform: rotate(-15deg);
    }
    
    .stat-icon { width: 32px; height: 32px; font-size: 1rem; }
    
    /* Custom colors */
    .text-primary-custom { color: var(--accent-blue); }
    .bg-icon-primary { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); }
    
    .text-success-custom { color: var(--success); }
    .bg-icon-success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); }
    
    .text-purple { color: var(--purple); }
    .bg-icon-purple { background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); }
    
    .text-warning-custom { color: var(--warning); }
    .bg-icon-warning { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); }
    
    .text-cyan { color: #06B6D4; }
    .bg-icon-cyan { background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); }
    
    .text-pink { color: #EC4899; }
    .bg-icon-pink { background: rgba(236, 72, 153, 0.1); border: 1px solid rgba(236, 72, 153, 0.2); }
  `]
})
export class DashboardStatsComponent implements OnInit {
  stats: { connectedCount?: number, questionsSentCount?: number } = { connectedCount: 0, questionsSentCount: 0 };
  
  constructor(private sessionService: SessionService) {}
  
  ngOnInit() {
    this.sessionService.statsSubject.subscribe(stats => {
      this.stats = { ...this.stats, ...stats };
    });
  }
}
