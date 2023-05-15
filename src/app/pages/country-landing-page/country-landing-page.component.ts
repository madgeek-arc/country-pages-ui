import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SurveyService} from "../../../survey-tool/app/services/survey.service";
import {SurveyAnswer} from "../../../survey-tool/app/domain/survey";
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
  stakeholderId: string = null;
  surveyId: string = null;
  surveyAnswer: SurveyAnswer = null;

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
            this.surveyService.getLatestAnswer(this.stakeholderId, this.surveyId).subscribe(
              res=> {
                this.surveyAnswer = res;
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
