import { Component, OnInit } from '@angular/core';
import { IdentityService } from './identity.service';

import { IdAuthInfo } from './idAuthInfo';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.less']
})
export class IdentityComponent implements OnInit {
  idAuthInfos: IdAuthInfo[];

  constructor(private identityService: IdentityService) {}

  ngOnInit() {
    this.getIdAuthInfos();
  }

  getIdAuthInfos(): void {
    this.identityService.getIdAuthInfos().subscribe(heroes => (this.idAuthInfos = heroes));
  }
}
