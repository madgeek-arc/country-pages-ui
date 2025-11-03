import { Component } from "@angular/core";
import { PageContentComponent } from "../../../survey-tool/app/shared/page-content/page-content.component";
import {
  SidebarMobileToggleComponent
} from "../../../survey-tool/app/shared/dashboard-side-menu/mobile-toggle/sidebar-mobile-toggle.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-temporary-unavailable',
  templateUrl: './temporary-unavailable.component.html',
  imports: [
    PageContentComponent,
    SidebarMobileToggleComponent,
    RouterLink
  ]
})

export class TemporaryUnavailableComponent {}
