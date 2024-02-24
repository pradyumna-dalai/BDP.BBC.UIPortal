import { Component } from '@angular/core';
import { BDPAuthService } from 'src/app/common/service';

@Component({
  selector: 'app-accessdenied',
  templateUrl: './app.accessdenied.component.html',
})
export class AppAccessdeniedComponent {

  constructor(private bdpAuthService: BDPAuthService) {}

  onLogout() {
    this.bdpAuthService.logout();
  }
}
