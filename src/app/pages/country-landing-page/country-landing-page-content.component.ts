import {Component, Input} from "@angular/core";
import {SurveyAnswerPublicMetadata} from "../../../survey-tool/app/domain/survey";
import { CountryPageOverviewData } from "src/app/domain/external-info-data";
import { GroupMembers } from "../../../survey-tool/app/domain/userInfo";

@Component({
    selector: 'app-country-landing-page-content',
    templateUrl: 'country-landing-page-content.component.html',
    styleUrls: ['./country-landing-page.component.css'],
    standalone: false
})

export class CountryLandingPageContentComponent {

  @Input('countryCode') countryCode: string = null;
  @Input('countryName') countryName: string = null;
  @Input('surveyAnswer') surveyAnswer: Object = null;
  @Input('surveyAnswerMetadata') surveyAnswerMetadata: SurveyAnswerPublicMetadata = null;
  @Input() members?: GroupMembers;
  @Input('countryPageOverviewData') countryPageOverviewData: CountryPageOverviewData;
  @Input('displayFullContent') displayFullContent: string = null;
  @Input() emptyAnswer: boolean = false;

}
