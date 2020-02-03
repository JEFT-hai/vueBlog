import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CompanyAuthService } from '../company-auth.service';
import { CompanyAuth } from '../companyAuth';

@Component({
  selector: 'app-company-auth-details',
  templateUrl: './company-auth-details.component.html',
  styleUrls: ['./company-auth-details.component.less']
})
export class CompanyAuthDetailsComponent implements OnInit {
  enity: CompanyAuth;
  constructor(private route: ActivatedRoute, private location: Location, private entityService: CompanyAuthService) {}

  ngOnInit() {
    this.getEntity();
  }

  getEntity(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.entityService.getEntity(id).subscribe(hero => (this.enity = hero));
  }

  goBack(): void {
    this.location.back();
  }

  saveOk(state: number) {
    this.enity.authState = state;
    this.entityService.updateEntity(this.enity).subscribe(() => this.goBack());
  }
}
