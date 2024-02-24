import { Component } from '@angular/core';
import { BDPAuthService } from 'src/app/common/service';

@Component({
  selector: 'app-auth0-error',
  templateUrl: './auth0-error.component.html',
  styleUrls: ['./auth0-error.component.scss']
})
export class Auth0ErrorComponent {

  constructor(private authService: BDPAuthService) { }

  gotoSignIn() {
    this.authService.logout();
  }
}
