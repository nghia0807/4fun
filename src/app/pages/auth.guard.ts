import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { MainStore } from './main-app.component.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const mainStore = inject(MainStore);

  if (authService.isLoggedIn()) {
    return true;
  }

  const requiredRole = route.data['role']; // Add role requirement in route configuration
  const userRole = mainStore.role();
  console.log(userRole);
  if (requiredRole && userRole !== requiredRole) {
    router.navigate(['/unauthorized']); // Redirect to unauthorized page
    return false;
  }

  return true;
};
