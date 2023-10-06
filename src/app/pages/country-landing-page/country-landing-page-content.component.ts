import {Component, Input} from "@angular/core";
import {SurveyAnswerPublicMetadata} from "../../../survey-tool/app/domain/survey";
import { CountryPageOverviewData } from "src/app/domain/external-info-data";

@Component({
  selector: 'app-country-landing-page-content',
  templateUrl: 'country-landing-page-content.component.html',
  styleUrls: ['./country-landing-page.component.css'],
})

export class CountryLandingPageContentComponent {

  @Input('countryCode') countryCode: string = null;
  @Input('surveyAnswer') surveyAnswer: Object = null;
  @Input('surveyAnswerMetadata') surveyAnswerMetadata: SurveyAnswerPublicMetadata = null;
  @Input('countryPageOverviewData') countryPageOverviewData: CountryPageOverviewData;
  @Input('displayFullContent') displayFullContent: string = null;
  @Input() emptyAnswer: boolean = false;

}
