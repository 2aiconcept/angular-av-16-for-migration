import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   canActivate(): boolean {
//     if (this.authService.isAuthenticated()) {
//       return true;
//     }
//     this.router.navigate(['/auth']);
//     return false;
//   }
// }

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
