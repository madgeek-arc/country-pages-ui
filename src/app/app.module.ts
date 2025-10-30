import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SurveyToolModule } from "../survey-tool/app/survey-tool.module";
import { UserService } from "../survey-tool/app/services/user.service";
import { SharedModule } from "./shared/shared.module";
import { HttpInterceptorService } from "./pages/services/http-interceptor.service";
import { CountryLandingPageComponent } from "./pages/country-landing-page/country-landing-page.component";
import { DataService } from "./pages/services/data.service";
import { DataHandlerService } from "./pages/services/data-handler.service";
import {
  CountryLandingPageContentComponent
} from './pages/country-landing-page/country-landing-page-content.component';
import {
  CountryLandingPageSurveyContentComponent
} from "./pages/country-landing-page/country-landing-page-survey-content.component";
import { SafeUrlPipe } from "../survey-tool/catalogue-ui/shared/pipes/safeUrlPipe";
import { ReusableComponentsModule } from "../survey-tool/app/shared/reusablecomponents/reusable-components.module";
import {
  ContributionsDashboardComponent
} from "../survey-tool/app/pages/contributions-dashboard/contributions-dashboard.component";

@NgModule({
  declarations: [
    AppComponent,
    CountryLandingPageComponent,
    CountryLandingPageContentComponent,
    CountryLandingPageSurveyContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    SurveyToolModule,
    ReusableComponentsModule,
    SafeUrlPipe,
    ContributionsDashboardComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    UserService,
    DataService,
    DataHandlerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
