import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GestionarUsuario } from './servicios/gestionar-usuario';

export const authGuard: CanActivateFn = () => {
  const auth = inject(GestionarUsuario);
  if (auth.estaAutenticado()) {
    return true;
  }
  // Si no está autenticado, redirigir al login
  const router = inject(Router);
  router.navigate(['/login']);
  return false;
};
