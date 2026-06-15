import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CandidateComponent } from './components/candidate/candidate.component';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'candidate/:sessionCode', component: CandidateComponent },
  { path: 'candidate', component: CandidateComponent },
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin' }
];
