import {
  HttpHandlerFn,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { GestionarUsuario } from './servicios/gestionar-usuario';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const auth = inject(GestionarUsuario);
  const router = inject(Router);
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        auth.logout().subscribe({
          next: () => {
            router.navigate(['/login']);
          }
        });
      }
      return throwError(() => err);
    })
  );
}
