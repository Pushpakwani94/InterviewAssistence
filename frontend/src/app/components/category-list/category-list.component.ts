import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStateService } from '../../services/admin-state.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel d-flex flex-column h-100">
      <!-- Header -->
      <div class="p-3 border-bottom border-dark-custom">
        <div class="text-secondary mb-1" style="font-size:0.8rem">
          <span class="text-main fw-bold">{{ state.activeTechnology().name }}</span> &gt; {{ state.activeCategory()?.name || 'All' }}
        </div>
        <h6 class="m-0 text-main fw-bold">Categories</h6>
      </div>

      <!-- Category List -->
      <div class="flex-grow-1 overflow-auto p-2 list-scroll">
        <ul class="nav flex-column gap-1">
          <li class="nav-item" *ngFor="let cat of state.categories()">
            <a href="javascript:void(0)" class="nav-link category-link d-flex justify-content-between align-items-center rounded" 
               [class.active]="state.activeCategory() === cat"
               (click)="state.selectCategory(cat)">
              <span><i class="bi" [ngClass]="state.activeCategory() === cat ? 'bi-folder2-open' : 'bi-folder2'"></i> {{ cat.name }}</span>
              <span class="badge" [ngClass]="state.activeCategory() === cat ? 'text-accent-blue' : 'text-secondary'">{{ cat.count }}</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Footer Action -->
      <div class="p-3 mt-auto">
        <button class="btn btn-outline-custom w-100 text-secondary"><i class="bi bi-plus"></i> Add Category</button>
      </div>
    </div>
  `,
  styles: [`
    .border-dark-custom { border-color: var(--border-color) !important; }
    .category-link {
      color: var(--text-secondary);
      padding: 10px 12px;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .category-link i { margin-right: 8px; opacity: 0.7; }
    .category-link:hover {
      background: rgba(255,255,255,0.03);
      color: var(--text-main);
    }
    .category-link.active {
      background: rgba(37, 99, 235, 0.1);
      color: var(--accent-blue);
      border: 1px solid rgba(37, 99, 235, 0.2);
    }
    .category-link.active i { opacity: 1; color: var(--accent-blue); }
    .text-accent-blue { color: var(--accent-blue); font-weight: bold; }
    
    .btn-outline-custom {
      border: 1px solid rgba(255,255,255,0.1);
      background: transparent;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-outline-custom:hover {
      background: rgba(255,255,255,0.05);
      color: var(--text-main) !important;
    }

    .list-scroll { scrollbar-width: none; } /* Firefox */
    .list-scroll::-webkit-scrollbar { display: none; } /* Chrome */
  `]
})
export class CategoryListComponent {
  state = inject(AdminStateService);
}
