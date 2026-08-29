import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './product-list/product-list.component';
import { PosComponent } from './pos/pos.component';
import { FbrSandboxComponent } from './fbr-sandbox/fbr-sandbox.component';

const routes: Routes = [
  { path: '', redirectTo: '/fbr-sandbox', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'pos', component: PosComponent },
  { path: 'sales', component: PosComponent },
  { path: 'fbr-sandbox', component: FbrSandboxComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }