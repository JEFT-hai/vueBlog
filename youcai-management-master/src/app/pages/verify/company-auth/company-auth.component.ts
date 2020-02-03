import { Component, OnInit } from '@angular/core';

import { CompanyAuth } from './companyAuth';
import { CompanyAuthService } from './company-auth.service';

@Component({
  selector: 'app-company-auth',
  templateUrl: './company-auth.component.html',
  styleUrls: ['./company-auth.component.less']
})
export class CompanyAuthComponent implements OnInit {
  companyAuths: CompanyAuth[];
  constructor(private entityService: CompanyAuthService) {}

  ngOnInit() {
    this.getList();
  }

  getList(): void {
    this.entityService.getList().subscribe(heroes => (this.companyAuths = heroes));
  }
}
