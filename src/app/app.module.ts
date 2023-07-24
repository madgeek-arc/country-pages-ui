import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgxMatomoTrackerModule} from '@ngx-matomo/tracker';
import {NgxMatomoRouterModule} from '@ngx-matomo/router';
import {SurveyToolModule} from "../survey-tool/app/survey-tool.module";
import {UserService} from "../survey-tool/app/services/user.service";
import {SharedModule} from "./shared/shared.module";
import {HttpInterceptorService} from "./pages/services/http-interceptor.service";
import {CountryLandingPageComponent} from "./pages/country-landing-page/country-landing-page.component";
import {DataService} from "./pages/services/data.service";
import {DataHandlerService} from "./pages/services/data-handler.service";
import {CountryLandingPageContentComponent} from "./pages/country-landing-page/country-landing-page-content.component";
import {
  CountryLandingPageEmbeddableComponent
} from "./pages/country-landing-page/country-landing-page-embeddable.component";
import {CatalogueUiSharedModule} from "../survey-tool/catalogue-ui/shared/catalogue-ui-shared.module";

@NgModule({
  declarations: [
    AppComponent,
    CountryLandingPageComponent,
    CountryLandingPageContentComponent,
    CountryLandingPageEmbeddableComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        SurveyToolModule,
        NgxMatomoTrackerModule.forRoot({trackerUrl: '', siteId: ''}),
        NgxMatomoRouterModule,
        CatalogueUiSharedModule,
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
