import {ActivationStart, NavigationEnd, Router} from '@angular/router';
import {Injectable, Type} from '@angular/core';
import {Subscription} from 'rxjs';
// import {LayoutService} from "../dashboard/sharedComponents/sidebar/layout.service";

@Injectable({
  providedIn: 'root'
})
export class SmoothScroll {
  private interval;
  private readonly sub;
  private lastComponent;
  private currentComponent: string;
  private extraOffset: number = 0;

  constructor(private router: Router) {
    if (typeof window !== "undefined") {
      this.sub = router.events.subscribe(event => {
        if (event instanceof ActivationStart) {
         this.extraOffset = event.snapshot.data.extraOffset?event.snapshot.data.extraOffset:0;
          if(event.snapshot.component instanceof Type) {
            this.currentComponent = event.snapshot.component.name;
          }
        } else if (event instanceof NavigationEnd) {
          // fixme replace??
          // let headerOffset = 80;
          let headerOffset = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + 35;

          // let headerOffset = (this.layoutService.isMobileValue?0:Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))) + 35;
          if(!this.router.getCurrentNavigation().extras?.state?.disableScroll) {
            if (this.interval) {
              clearInterval(this.interval);
            }
            const fragment = router.parseUrl(router.url).fragment;
            if (this.lastComponent !== this.currentComponent) {
              window.scrollTo({top: 0});
            }
            if (fragment) {
              let i = 0;
              this.interval = setInterval(() => {
                i++;
                const element = document.getElementById(fragment);
                if (element) {
                  if (this.interval) {
                    clearInterval(this.interval);
                  }
                  const yOffset = -headerOffset - this.extraOffset;
                  let position = 0;
                  let interval = setInterval(() => {
                    if (position !== element.getBoundingClientRect().top) {
                      position = element.getBoundingClientRect().top;
                    } else {
                      clearInterval(interval);
                      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                      window.scrollTo({top: y, behavior: 'smooth'});
                    }
                  }, 50);
                }
                if (i > 4 && this.interval) {
                  clearInterval(this.interval);
                }
              }, 100);
            } else {
              setTimeout( () => {
                window.scrollTo({top: 0, behavior: 'smooth'});
              }, 0);
            }
          }
          this.lastComponent = this.currentComponent;
        }
      });
    }
  }

  public clearSubscriptions() {
    if (this.sub && this.sub instanceof Subscription) {
      this.sub.unsubscribe();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
