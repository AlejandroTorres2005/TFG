import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Clase } from '../interfaces/clase';

@Injectable({
  providedIn: 'root'
})
export class GestionarClases {
  private apiUrl = 'http://localhost:3000/clases';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error en el cliente:', error.error.message);
      return throwError(() => 'No se pudo conectar con el servidor. Verifique su conexión.');
    } else {
      console.error(`Error en el servidor ${error.status}, body:`, error.error);
      return throwError(() => `Error del servidor: ${error.message}`);
    }
  }

  getClases(): Observable<Clase[]> {
    return this.http.get<Clase[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getClase(_id: string): Observable<Clase> {
    return this.http.get<Clase>(`${this.apiUrl}/${_id}`)
      .pipe(catchError(this.handleError));
  }

  addClase(clase: Clase): Observable<Clase> {
    return this.http.post<Clase>(this.apiUrl, clase);
  }

  updateClase(_id: string, clase: Clase): Observable<Clase> {
    return this.http.put<Clase>(`${this.apiUrl}/${_id}`, clase)
      .pipe(catchError(this.handleError));
  }

  deleteClase(_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${_id}`)
      .pipe(catchError(this.handleError));
  }
}
