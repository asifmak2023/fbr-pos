import { Routes } from '@angular/router';
import { FbrSandboxComponent } from './fbr-sandbox/fbr-sandbox.component';

export const routes: Routes = [
  { path: 'fbr-sandbox', component: FbrSandboxComponent },
  { path: '', redirectTo: '/fbr-sandbox', pathMatch: 'full' }
];
