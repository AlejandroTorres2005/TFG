import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders }   from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Profesor } from '../interfaces/profesor';

@Injectable({
  providedIn: 'root'
})
export class GestionarProfesores {
  private apiUrl = 'http://localhost:3000/profesores';
  private cache: Profesor[] | null = null;

  constructor(private http: HttpClient) { }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      console.error('Error en el cliente:', error.error.message);
      return throwError(() => 'No se pudo conectar con el servidor. Verifique su conexión.');
    } else {
      // Error del lado del servidor
      console.error(`Error en el servidor ${error.status}, body:`, error.error);
      return throwError(() => `Error del servidor: ${error.message}`);
    }
  }

  getProfesores(): Observable<Profesor[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<Profesor[]>(this.apiUrl)
      .pipe(tap(datos => this.cache = datos), catchError(this.handleError));
  }

  getEquipo(_id: string): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.apiUrl}/${_id}`)
      .pipe(catchError(this.handleError));
  }

  addEquipo(equipo: Profesor): Observable<Profesor> {
    this.cache = null;
    return this.http.post<Profesor>(this.apiUrl, equipo)
      .pipe(catchError(this.handleError));
  }

  updateEquipo(_id: string, equipo: Profesor): Observable<Profesor> {
    this.cache = null;
    return this.http.put<Profesor>(`${this.apiUrl}/${_id}`, equipo)
      .pipe(catchError(this.handleError));
  }

  deleteEquipo(_id: string): Observable<any> {
    this.cache = null;
    return this.http.delete(`${this.apiUrl}/${_id}`)
      .pipe(catchError(this.handleError));
  }

}
