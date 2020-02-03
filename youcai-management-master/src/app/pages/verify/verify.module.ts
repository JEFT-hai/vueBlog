import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { VerifyRoutingModule } from './verify-routing.module';
import { IdentityComponent } from './identity/identity.component';
import { AuthStatePipe } from './auth-state.pipe';
import { DetailsComponent } from './identity/details/details.component';
import { CompanyAuthComponent } from './company-auth/company-auth.component';
import { CompanyAuthDetailsComponent } from './company-auth/details/company-auth-details.component';

@NgModule({
  declarations: [IdentityComponent, AuthStatePipe, DetailsComponent, CompanyAuthComponent, CompanyAuthDetailsComponent],
  imports: [CommonModule, VerifyRoutingModule, NzTableModule, NzDividerModule, NzDescriptionsModule, FormsModule, NzInputModule, NzButtonModule, NzIconModule]
})
export class VerifyModule {}
