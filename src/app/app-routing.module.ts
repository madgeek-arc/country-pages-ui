import {NgModule} from '@angular/core';
import {RouterModule, Routes, UrlMatchResult, UrlSegment} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {CountryLandingPageComponent} from "./pages/country-landing-page/country-landing-page.component";

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
  // {
  //   path: 'country/:code',
  //   children: [
  //     {
  //       path: '',
  //       component: CountryLandingPageComponent
  //     },
  //     {
  //       path: 'overview',
  //       component: OverviewTabsComponent,
  //       children: [
  //         {
  //           path: '',
  //           redirectTo: 'overview',
  //           pathMatch: 'full'
  //         },
  //         {
  //           path: 'overview',
  //           component: OverviewComponent
  //         },
  //         {
  //           path: 'keyActors',
  //           component: CountryLandingPageComponent
  //         },
  //         {
  //           path: 'keyActors',
  //           component: CountryLandingPageComponent
  //         },
  //         {
  //           path: 'Miscellaneous',
  //           component: CountryLandingPageComponent
  //         }
  //       ]
  //     },
  //     {
  //       path: 'policies',
  //       component: CountryLandingPageComponent
  //     },
  //     {
  //       path: 'infrastructure',
  //       component: CountryLandingPageComponent
  //     },
  //     {
  //       path: 'skills',
  //       component: CountryLandingPageComponent
  //     },
  //     {
  //       path: 'about',
  //       component: CountryLandingPageComponent
  //     }
  //
  //   ],
  //   component: CountryLandingPageComponent
  // },
  {
    path: 'embeddable/country/:code',
    component: CountryLandingPageComponent
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
    return <UrlMatchResult>(null as any);
  }
  return <UrlMatchResult>(null as any);
}

