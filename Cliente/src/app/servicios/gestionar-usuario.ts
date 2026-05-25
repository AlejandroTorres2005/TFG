import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { RespuestaAuth } from '../interfaces/respuestaAuth';

@Injectable({
  providedIn: 'root'
})
export class GestionarUsuario {
  private http = inject(HttpClient);

  private apiURL =  'http://localhost:3000/usuarios';

  private _usuarioActual = signal<string | null>(null);
  usuarioActual = this._usuarioActual.asReadonly();

  private _perfil = signal<string>('');
  perfil = this._perfil.asReadonly();

  esAdmin = computed(() => this._perfil() === 'Admin');

  estaAutenticado = computed(() => this.usuarioActual() !== null);

  registro(codigo: string, clave: string, nombre: string, email: string) {
    return this.http.post<{ message: string }>(
      this.apiURL + "/registro",
      { codigo, clave, nombre, email }
    ).pipe(
      catchError(err => {
        console.error("Error en registro:", err);
        return throwError(() => err);
      })
    );
  }

  login(codigo: string, clave: string) {
    return this.http.post<RespuestaAuth>(
      this.apiURL + "/login",
      { codigo, clave }
    ).pipe(
      tap(response => {
        this._usuarioActual.set(response.nombre || response.codigo || null);
        this._perfil.set(response.perfil ?? '');
      }),
      catchError(err => {
        console.error("Error en login:", err);
        return throwError(() => err);
      })
    );
  }

  logout() {
    return this.http.post<void>(
      this.apiURL + "/logout",
      {}
    ).pipe(
      tap(() => {
        this._usuarioActual.set(null);
        this._perfil.set('');
      }),
      catchError(err => {
        console.error("Error en logout:", err);
        return throwError(() => err);
      })
    );
  }
}
