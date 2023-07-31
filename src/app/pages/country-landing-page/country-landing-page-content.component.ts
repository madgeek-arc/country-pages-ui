import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from "@angular/core";
import {SurveyAnswerPublicMetadata} from "../../../survey-tool/app/domain/survey";
import { CountryPageOverviewData } from "src/app/domain/external-info-data";
import {ActivatedRoute, IsActiveMatchOptions, Router} from "@angular/router";
import * as UIkit from 'uikit';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-country-landing-page-content',
  templateUrl: 'country-landing-page-content.component.html',
  styleUrls: ['./country-landing-page.component.css'],
})

export class CountryLandingPageContentComponent implements OnInit {


  test: HTMLElement;

  @Input('countryCode') countryCode: string = null;
  @Input('surveyAnswer') surveyAnswer: Object = null;
  @Input('surveyAnswerMetadata') surveyAnswerMetadata: SurveyAnswerPublicMetadata = null;
  @Input('countryPageOverviewData') countryPageOverviewData: CountryPageOverviewData;
  @Input('displayFullContent') displayFullContent: string = null;

  public active_fragment: BehaviorSubject<string> = new BehaviorSubject('');

  code: string = null;
  tab: string = null;
  subTab: string = null;
  fragment: string = null;
  tabSwitcher = null;
  subTabSwitcher = null;
  private observer: IntersectionObserver;
  private timeout: any;

  public linkActiveOptions: IsActiveMatchOptions = {
    matrixParams: 'exact',
    queryParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  };

  constructor(public route: ActivatedRoute, private router: Router) {
    this.route.fragment.subscribe((frag) => {
      this.active_fragment.next(frag);
    });
  }

  ngOnInit() {

    this.tabSwitcher = UIkit.switcher('#chapter-tabs',{});
    console.log(this.tabSwitcher);

    this.subTabSwitcher = UIkit.switcher('#sections-tab',{});
    console.log(this.subTabSwitcher);

    this.route.params.subscribe(
      params => {
        this.code = params['code']
        if (params['tab']) {
          this.tab = params['tab'];
          this.tabSelector(this.tab);
        }
        if (params['subTab']) {
          this.subTab = params['subTab'];
          this.subTabSelector(this.subTab);
        }
      });
    //
    // this.route.fragment.subscribe(
    //   fragment => {
    //     this.fragment = fragment
    //   }
    // );
  }

  getDomElement(id: string) {
    setTimeout(()=> {
      this.test = document.getElementById(id);

      // this.test?.childNodes.forEach(node => {
      //   console.log(node);
      //   console.log(node['offsetTop']);
      // });
    }, 0);

  }

  @HostListener('window:scroll', ['$event'])
  private _update_active_fragment(event: any) {
    if (this.test) {
      this.test.childNodes.forEach(child => {
        const scrollY = window.scrollY + 300;
        if (child['offsetTop'] > scrollY)
          return;

        if (child.nextSibling === null &&  scrollY > child['offsetTop']) {
          this.active_fragment.next(child['id']);
          console.log(child['id']);
          return;
        }

        if (scrollY > child['offsetTop'] && scrollY < child.nextSibling?.['offsetTop']) {
          // console.log(child['id']);
          // console.log('window scrollY: '+scrollY);
          // console.log('child offsetTop: ' + child['offsetTop']);
          // console.log('next child offsetTop: ' + child.nextSibling?.['offsetTop']);
          if (this.active_fragment === child['id'])
            return;
          if (this.timeout) {
            clearTimeout(this.timeout);
          }
          this.timeout = setTimeout(() => {
            this.router.navigate(['./'], {
              fragment: child['id'],
              relativeTo: this.route,
              // state: {disableScroll: true},
              // queryParamsHandling: 'merge'
            });
          }, 200);
          return;
        }

      });
    }
    event.preventDefault();
  }

  // private setObserver() {
  //   if (this.observer) {
  //     this.observer.disconnect();
  //   }
  //   this.observer = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         if (this.timeout) {
  //           clearTimeout(this.timeout);
  //         }
  //         this.timeout = setTimeout(() => {
  //           this.router.navigate(['./'], {
  //             fragment: entry.target.id,
  //             relativeTo: this.route,
  //             state: {disableScroll: true},
  //             queryParamsHandling: 'merge'
  //           });
  //         }, 200);
  //       }
  //     });
  //   }, {threshold: 0.1});
  //   this.tabs.forEach(tab => {
  //     let element = document.getElementById(tab['id']);
  //     if (element) {
  //       this.observer.observe(element);
  //     }
  //   });
  // }

  tabSelector(tab: string) {
    switch (tab) {
      case 'overview':
        this.tabSwitcher.show(0)
        break;
      case 'policies':
        this.tabSwitcher.show(1)
        break;
      case 'infrastructure':
        this.tabSwitcher.show(2)
        break;
      case 'skills':
        this.tabSwitcher.show(3)
        break;
      case 'about':
        this.tabSwitcher.show(4)
        break;
      default:
        this.tabSwitcher.show(0)
    }
  }

  subTabSelector(subTab: string) {
    switch (subTab) {
      case 'overview':
        this.subTabSwitcher.show(0)
        break;
      case 'keyActors':
        this.subTabSwitcher.show(1)
        break;
      case 'initiatives':
        this.subTabSwitcher.show(2)
        break;
      case 'miscellaneous':
        this.subTabSwitcher.show(3)
        break;
      default:
        this.subTabSwitcher.show(0)
    }
  }
}
