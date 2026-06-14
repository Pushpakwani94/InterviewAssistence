import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStateService } from '../../services/admin-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar d-flex flex-column h-100 p-3">
      <!-- Logo -->
      <div class="d-flex align-items-center mb-4 ps-2 mt-2 gap-3">
        <div class="logo-icon bg-primary-custom d-flex align-items-center justify-content-center text-white rounded">
          <i class="bi bi-chat-square-text-fill"></i>
        </div>
        <div>
          <h5 class="m-0 text-main fw-bold fs-6">Interview Assistant</h5>
          <small class="text-secondary" style="font-size:0.75rem;">Admin Panel</small>
        </div>
      </div>

      <div class="flex-grow-1 overflow-auto pe-2 sidebar-scroll">
        <!-- Main Menu -->
        <h6 class="nav-header">MAIN MENU</h6>
        <ul class="nav flex-column mb-4">
          <li class="nav-item">
            <a href="#" class="nav-link active"><i class="bi bi-house-door"></i> Dashboard</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link"><i class="bi bi-camera-video"></i> Live Sessions</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link px-3 py-2 rounded d-flex align-items-center gap-3 hover-bg fw-bold"
               [ngClass]="!state.isManualEntryMode() ? 'bg-primary-custom text-white' : 'text-light'"
               (click)="state.setManualEntryMode(false)">
              <i class="bi bi-stack"></i> Question Bank
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link px-3 py-2 rounded d-flex align-items-center gap-3 hover-bg fw-bold"
               [ngClass]="state.isManualEntryMode() ? 'bg-primary-custom text-white' : 'text-light'"
               (click)="state.setManualEntryMode(true)">
              <i class="bi bi-pencil-square" [ngClass]="!state.isManualEntryMode() ? 'text-neon' : ''"></i> Custom Send (Help)
            </a>
          </li>
        </ul>

        <!-- Technologies -->
        <h6 class="nav-header">TECHNOLOGIES</h6>
        <ul class="nav flex-column mb-4">
          <li class="nav-item" *ngFor="let tech of state.technologies()">
            <a href="javascript:void(0)" class="nav-link d-flex justify-content-between align-items-center" 
               [class.active]="state.activeTechnology() === tech"
               (click)="state.selectTechnology(tech)">
              <span><i class="bi bi-folder2"></i> {{ tech.name }}</span>
              <span class="badge" [class.bg-primary-custom]="state.activeTechnology() === tech">{{ tech.count }}</span>
            </a>
          </li>
          <li class="nav-item mt-1">
            <a href="#" class="nav-link text-muted-custom"><i class="bi bi-plus"></i> More Technologies <i class="bi bi-chevron-right ms-auto" style="font-size:0.75rem"></i></a>
          </li>
        </ul>

        <!-- Bottom Links -->
        <ul class="nav flex-column mb-4">
          <li class="nav-item"><a href="#" class="nav-link"><i class="bi bi-upload"></i> Import & Export</a></li>
          <li class="nav-item"><a href="#" class="nav-link"><i class="bi bi-heart"></i> Favorites</a></li>
          <li class="nav-item"><a href="#" class="nav-link"><i class="bi bi-clock-history"></i> Recently Viewed</a></li>
          <li class="nav-item"><a href="#" class="nav-link"><i class="bi bi-graph-up"></i> Analytics & Reports</a></li>
          <li class="nav-item">
            <a href="#" class="nav-link d-flex justify-content-between align-items-center">
              <span><i class="bi bi-people"></i> User Management</span>
              <i class="bi bi-chevron-down" style="font-size:0.75rem"></i>
            </a>
          </li>
          <li class="nav-item"><a href="#" class="nav-link"><i class="bi bi-gear"></i> Settings</a></li>
          <li class="nav-item"><a href="#" class="nav-link"><i class="bi bi-question-circle"></i> Help & Support</a></li>
        </ul>
      </div>

    </div>
  `,
  styles: [`
    .sidebar { width: var(--sidebar-width); background: var(--bg-main); border-right: 1px solid var(--border-color); }
    .logo-icon { width: 36px; height: 36px; background: var(--primary-blue); }
    .nav-header { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); letter-spacing: 0.5px; margin-bottom: 10px; padding-left: 10px; }
    .nav-link { color: var(--text-secondary); padding: 8px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; margin-bottom: 2px; }
    .nav-link i { margin-right: 8px; font-size: 1rem; opacity: 0.8; }
    .nav-link:hover { background: rgba(255,255,255,0.05); color: var(--text-main); }
    .nav-link.active { background: rgba(37, 99, 235, 0.1); color: var(--primary-blue); border-left: 3px solid var(--primary-blue); border-top-left-radius: 0; border-bottom-left-radius: 0; }
    .nav-link.active i { opacity: 1; }
    .badge { background: transparent; color: var(--text-secondary); font-weight: 500; }
    .bg-primary-custom { background: var(--primary-blue) !important; color: white; }
    .sidebar-scroll { scrollbar-width: none; } /* Firefox */
    .sidebar-scroll::-webkit-scrollbar { display: none; } /* Chrome */
  `]
})
export class SidebarComponent {
  state = inject(AdminStateService);
}
