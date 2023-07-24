import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SurveyService} from "../../../survey-tool/app/services/survey.service";
import {SurveyAnswerPublicMetadata} from "../../../survey-tool/app/domain/survey";
import { CountryPageOverviewData } from "src/app/domain/external-info-data";
import {DataService} from "../services/data.service";
import {DataHandlerService} from "../services/data-handler.service";

@Component({
  selector: 'app-country-landing-page-embeddable',
  templateUrl: 'country-landing-page-embeddable.component.html',
  styleUrls: ['./country-landing-page.component.css'],
})

export class CountryLandingPageEmbeddableComponent implements OnInit {

  countryCode: string = null;
  stakeholderId: string = null;
  surveyId: string = null;
  surveyAnswer: Object = null;
  surveyAnswerMetadata: SurveyAnswerPublicMetadata = null;

  countryPageOverviewData: CountryPageOverviewData;

  constructor(private route: ActivatedRoute, private surveyService: SurveyService,
              private dataService: DataService, private dataHandlerService: DataHandlerService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.countryCode = params['code'];
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

}
