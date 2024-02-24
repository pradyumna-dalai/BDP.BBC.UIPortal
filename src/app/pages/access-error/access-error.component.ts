import { Component } from '@angular/core';
import { BDPAuthService } from 'src/app/common/service';

@Component({
  selector: 'app-access-error',
  templateUrl: './access-error.component.html',
  styleUrls: ['./access-error.component.scss']
})
export class AccessErrorComponent {

  constructor(private authService: BDPAuthService) { }

  gotoSignIn() {
    this.authService.logout();
  }
}
