import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentityComponent } from './identity/identity.component';
import { DetailsComponent } from './identity/details/details.component';
import { CompanyAuthComponent } from './company-auth/company-auth.component';
import { CompanyAuthDetailsComponent } from './company-auth/details/company-auth-details.component';

const routes: Routes = [
  { path: 'identity', component: IdentityComponent, pathMatch: 'full' },
  { path: 'identity/details/:id', component: DetailsComponent },
  { path: 'company-auth', component: CompanyAuthComponent, pathMatch: 'full' },
  { path: 'company-auth/company-auth-details/:id', component: CompanyAuthDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyRoutingModule {}
