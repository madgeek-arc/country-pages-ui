import { of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { UserService } from "../../../survey-tool/app/services/user.service";
import { UserInfo } from "../../../survey-tool/app/domain/userInfo";
import { AuthenticationService } from "../../../survey-tool/app/services/authentication.service";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";


export const ArchiveGuardService: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const userService = inject(UserService);

  return userService.getUserInfo().pipe(
    switchMap((res: UserInfo) => {
      if (res !== null) {
        if (res.coordinators.filter(c => c.type === 'country').length > 0) {
          return of(true);
        }
        router.navigate(["/"]).then();
        return of(false);
      } else {
        // console.log('Not authorized');
        router.navigate(["/"]).then();
        return of(false);
      }
    }),
    catchError(() => {
      // console.log('Not authorized 2');
      authenticationService.tryLogin();
      return of(false);
    })
  );

}
