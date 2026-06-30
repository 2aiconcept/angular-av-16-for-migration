import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

// @Injectable({ providedIn: 'root' })
// export class PublicGuard implements CanActivate {
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   canActivate(): boolean {
//     if (this.authService.isAuthenticated()) {
//       this.router.navigate(['/companies']);
//       return false;
//     }
//     return true;
//   }
// }

export const PublicGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
