import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SurveyService } from "../../../survey-tool/app/services/survey.service";
import { SurveyAnswerPublicMetadata } from "../../../survey-tool/app/domain/survey";
import { CountryPageOverviewData } from "src/app/domain/external-info-data";
import { DataService } from "../services/data.service";
import { DataHandlerService } from "../services/data-handler.service";
import { countries } from "../../../survey-tool/app/domain/countries";

@Component({
  selector: 'app-country-landing-page',
  templateUrl: 'country-landing-page.component.html',
  styleUrls: ['./country-landing-page.component.css'],
})

export class CountryLandingPageComponent implements OnInit {

  countryCode: string = null;
  showFullContent: string = null;
  stakeholderId: string = null;
  embedUrl: string = null;
  surveyId: string = null;
  surveyAnswer: Object = null;
  surveyAnswerMetadata: SurveyAnswerPublicMetadata = null;
  emptyAnswer: boolean = false;
  countryName: string = null;


  countryPageOverviewData: CountryPageOverviewData;

  constructor(private route: ActivatedRoute, private router:Router, private surveyService: SurveyService,
              private dataService: DataService, private dataHandlerService: DataHandlerService) {
  }

  ngOnInit() {

    this.route.params.subscribe(
      params => {
        this.countryCode = params['code'];
        this.route.queryParams.subscribe(
          qParams => {
            if (qParams['showFull']) {
              this.showFullContent = qParams['showFull'];
            } else {
              this.showFullContent = 'true';
            }
            this.embedUrl = location.origin + `/embeddable/country/${this.countryCode}`
          }
        );
        this.countryName = this.getCountryName(this.countryCode);
        this.stakeholderId = 'sh-country-'+this.countryCode;
        // this.surveyService.getSurveys('stakeholderId', this.stakeholderId).subscribe(
        this.surveyService.getSurveys('type', 'country').subscribe(
          next => {
            this.surveyId = next.results[0].id;
            this.surveyService.getPublicAnswer(this.stakeholderId, this.surveyId).subscribe(
              res=> {
                this.surveyAnswer = res;
              }
            );
            this.surveyService.getPublicAnswerMetadata(this.stakeholderId, this.surveyId).subscribe(
              res=> {
                this.surveyAnswerMetadata = res;
                if (this.surveyAnswerMetadata.editors.length === 0) {
                  this.emptyAnswer = true;
                }
              }
            );
          });

        this.dataService.getCountryPageOverviewData(this.countryCode).subscribe(
          rawData => {
            this.countryPageOverviewData = this.dataHandlerService.convertRawDataToCountryPageOverviewData(rawData);
          }, error => {
            console.log(error);
          }
        );
      }
    );
  }

  isEmbedRoute() {
    return (this.router.url.startsWith('/embeddable'));
  }

  getCountryName(code: string) {
    return countries.find((country) => country.id === code).name || '';
  }

}
