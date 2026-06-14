import { Component, inject } from '@angular/core';
import { AdminStateService } from '../../services/admin-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <header class="navbar d-flex align-items-center justify-content-between px-3 px-md-4">
      <div class="d-flex align-items-center flex-grow-1">
        <button class="btn-icon me-2 me-md-4 d-md-none" (click)="state.toggleMobileSidebar()"><i class="bi bi-list"></i></button>
      </div>

      <div class="d-flex align-items-center gap-2 gap-md-4">
        <!-- Session Code Badge -->
        <div class="session-badge d-none d-sm-flex align-items-center rounded border border-secondary px-2 px-md-3 py-1 bg-panel">
          <div class="me-2 me-md-3">
            <small class="text-secondary d-block" style="font-size:0.65rem; line-height: 1;">Session Code</small>
            <span class="text-accent-blue fw-bold" style="font-size:0.8rem;">JAVA123</span>
          </div>
          <button class="btn-icon p-1 text-secondary"><i class="bi bi-copy" style="font-size:0.8rem;"></i></button>
        </div>

        <!-- Icons -->
        <div class="d-flex align-items-center gap-2">
          <button class="btn-icon position-relative">
            <i class="bi bi-bell"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark" style="font-size:0.5rem; padding: 2px 4px;">8</span>
          </button>
          <button class="btn-icon position-relative">
            <i class="bi bi-chat-text"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-dark" style="font-size:0.5rem; padding: 2px 4px;">12</span>
          </button>
          <button class="btn-icon"><i class="bi bi-moon"></i></button>
        </div>

        <!-- Profile -->
        <div class="d-flex align-items-center gap-2 ms-1 ms-md-2 cursor-pointer profile-hover rounded p-1 pe-2">
          <img src="https://ui-avatars.com/api/?name=Admin&background=1E293B&color=F8FAFC" alt="Admin" class="rounded-circle" width="32" height="32">
          <div class="d-none d-md-block">
            <div class="fw-bold text-main" style="font-size:0.85rem; line-height:1.2;">Admin</div>
            <div class="text-secondary" style="font-size:0.7rem;">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar { height: var(--header-height); border-bottom: 1px solid var(--border-color); background: var(--bg-main); }
    .search-container { width: 450px; }
    .search-input { border-radius: 20px; background: rgba(30, 41, 59, 0.4); border-color: rgba(255,255,255,0.05); }
    .search-input:focus { background: var(--bg-card); }
    .shortcut-key { right: 10px; font-size: 0.65rem; background: rgba(255,255,255,0.05); padding: 2px 6px; color: var(--text-secondary); border: 1px solid rgba(255,255,255,0.1); }
    .text-accent-blue { color: var(--accent-blue); }
    .bg-panel { background: rgba(30, 41, 59, 0.3) !important; }
    .profile-hover:hover { background: rgba(255,255,255,0.05); }
  `]
})
export class NavbarComponent {
  state = inject(AdminStateService);
}
