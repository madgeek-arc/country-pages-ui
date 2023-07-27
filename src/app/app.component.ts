import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../survey-tool/app/services/authentication.service";
import {SmoothScroll} from "./pages/services/smooth-scroll";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'country-pages-ui';

  constructor(private router: Router, private auth: AuthenticationService, private smoothScroll: SmoothScroll) {
    this.auth.redirect();
  }

  isContributionsDashboardRoute() {
    return (this.router.url.startsWith('/contributions'));
  }

  isEOSCReadinessDashboardRoute() {
    return (this.router.url.startsWith('/eoscreadiness'));
  }

  isEmbedRoute() {
    return (this.router.url.startsWith('/embeddable'));
  }
}
