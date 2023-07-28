import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {SurveyAnswerPublicMetadata} from "../../../survey-tool/app/domain/survey";
import { CountryPageOverviewData } from "src/app/domain/external-info-data";
import {ActivatedRoute, Router} from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-country-landing-page-content',
  templateUrl: 'country-landing-page-content.component.html',
  styleUrls: ['./country-landing-page.component.css'],
})

export class CountryLandingPageContentComponent implements OnInit, AfterViewInit {

  @ViewChild('sections') private sections: ElementRef;

  @Input('countryCode') countryCode: string = null;
  @Input('surveyAnswer') surveyAnswer: Object = null;
  @Input('surveyAnswerMetadata') surveyAnswerMetadata: SurveyAnswerPublicMetadata = null;
  @Input('countryPageOverviewData') countryPageOverviewData: CountryPageOverviewData;
  @Input('displayFullContent') displayFullContent: string = null;

  code: string = null;
  tab: string = null;
  subTab: string = null;
  fragment: string = null;

  constructor(public route: ActivatedRoute, private _location: Location, private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        console.log(params);
        this.code = params['code']
        if (params['tab'])
          this.tab = params['tab'];
        if (params['subTab'])
          this.subTab = params['subTab'];
      });

    this.route.fragment.subscribe(
      fragment => {
        console.log(fragment);
        this.fragment = fragment
      }
    );
  }

  onOutletLoaded(component) {
    component.surveyAnswer = this.surveyAnswer;
  }

  ngAfterViewInit() {
    // after view init updated current scroll position
    const prevScrollPos = this.router.getCurrentNavigation()?.extras?.state?.scrollTop;
    if (prevScrollPos) {
      this.sections.nativeElement.scrollTop = prevScrollPos;
    }
  }

  locationGo(path:string, subTab?: string) {
    // if (subTab) {
    //   this.router.navigate([tab, subTab], {relativeTo: this.route});
    //   return;
    // }
    this.router.navigate([path]);
  }

}
