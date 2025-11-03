import {NgModule} from '@angular/core';
import {RouterModule, Routes, UrlMatchResult, UrlSegment} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {CountryLandingPageComponent} from "./pages/country-landing-page/country-landing-page.component";
import { TemporaryUnavailableComponent } from "./shared/temporary-unavailable/temporary-unavailable.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    matcher: userPageMatcher,
    component: CountryLandingPageComponent,
    data: {
      scrollToTop: false,
      extraOffset: 150
    }
  },
  {
    path: 'contributions/:id/messages',
    loadComponent: () => TemporaryUnavailableComponent
    // loadChildren: () => import('../messaging-system-ui/app/messaging-system.module').then(m => m.MessagingSystemModule),
  },
  {
    path: '',
    loadChildren: () => import('../survey-tool/app/survey-tool.module').then(m => m.SurveyToolModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export function userPageMatcher(segments: UrlSegment[]): UrlMatchResult {
  if (segments.length > 1 && segments[0].path === 'country') {
    if (segments.length === 2) {
      return {
        consumed: segments,
        posParams: { code: segments[1] },
      };
    }
    if (segments.length === 3) {
      return {
        consumed: segments,
        posParams: { code: segments[1], tab: segments[2] },
      };
    }
    if (segments.length === 4) {
      return {
        consumed: segments,
        posParams: { code: segments[1], tab: segments[2], subTab: segments[3] },
      };
    }
    // return <UrlMatchResult>(null as any);
  }
  if (segments.length > 2 && segments[0].path === 'embeddable') {
    if (segments.length === 3) {
      return {
        consumed: segments,
        posParams: { code: segments[2] },
      };
    }
    if (segments.length === 4) {
      return {
        consumed: segments,
        posParams: { code: segments[2], tab: segments[3] },
      };
    }
    if (segments.length === 5) {
      return {
        consumed: segments,
        posParams: { code: segments[2], tab: segments[3], subTab: segments[4] },
      };
    }
    // return <UrlMatchResult>(null as any);
  }
  return <UrlMatchResult>(null as any);
}

