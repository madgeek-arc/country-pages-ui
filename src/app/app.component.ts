import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "./services/user.service";
import {LoginService} from "./services/login.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'observatory-ui';

  constructor(private router: Router) {
  }

  isContributionsDashboardRoute() {
    return (this.router.url.startsWith('/contributions'));
  }

}
