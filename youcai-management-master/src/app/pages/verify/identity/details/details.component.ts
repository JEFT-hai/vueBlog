import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { IdAuthInfo } from '../idAuthInfo';
import { IdentityService } from '../identity.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class DetailsComponent implements OnInit {
  idAuthInfo: IdAuthInfo;
  constructor(private route: ActivatedRoute, private location: Location, private identityService: IdentityService) {}

  ngOnInit() {
    this.getIdAuthInfo();
  }

  getIdAuthInfo(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.identityService.getIdAuthInfo(id).subscribe(hero => (this.idAuthInfo = hero));
  }

  goBack(): void {
    this.location.back();
  }

  saveOk(state: number) {
    this.idAuthInfo.idAuthState = state;
    this.identityService.updateIdAuthInfo(this.idAuthInfo).subscribe(() => this.goBack());
  }
}
