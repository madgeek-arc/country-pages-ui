import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyService} from "../../../survey-tool/app/services/survey.service";
import {SurveyAnswer, SurveyAnswerPublicMetadata} from "../../../survey-tool/app/domain/survey";
import { CountryPageOverviewData } from "src/app/domain/external-info-data";
import {DataService} from "../services/data.service";
import {DataHandlerService} from "../services/data-handler.service";

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
            console.log(qParams)
            if (qParams['showFull']) {
              console.log(qParams['showFull']);
              this.showFullContent = qParams['showFull'];
            } else {
              this.showFullContent = 'true';
            }
            this.embedUrl = location.origin + `/embeddable/country/${this.countryCode}`
          }
        );
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
                console.log(res);
              }
            );
          });

        this.dataService.getCountryPageOverviewData(this.countryCode).subscribe(
          rawData => {
            this.countryPageOverviewData = this.dataHandlerService.convertRawDataToCountryPageOverviewData(rawData);
            console.log(this.countryPageOverviewData.name);
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

}
