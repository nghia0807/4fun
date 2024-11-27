import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { MainStore } from './main-app.component.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const mainStore = inject(MainStore);

  console.log('IsLoggedIn:', authService.isLoggedIn());
  console.log('Required Role:', route.data['role']);
  console.log('Current User Role:', mainStore.role());

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data['role'];
  const userRole = mainStore.role();

  if (requiredRole && userRole !== requiredRole) {
    console.log('Role mismatch, redirecting to login');
    router.navigate(['/login']); 
    return false;
  }

  return true;
};