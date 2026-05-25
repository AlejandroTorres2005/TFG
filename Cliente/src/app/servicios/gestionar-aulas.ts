import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Aula } from '../interfaces/aula';

@Injectable({
  providedIn: 'root'
})
export class GestionarAulas {
  private apiUrl = 'http://localhost:3000/aulas';

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

  getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getAula(_id: string): Observable<Aula> {
    return this.http.get<Aula>(`${this.apiUrl}/${_id}`)
      .pipe(catchError(this.handleError));
  }

  addAula(aula: Aula): Observable<Aula> {
    return this.http.post<Aula>(this.apiUrl, aula);
  }

  updateAula(_id: string, aula: Aula): Observable<Aula> {
    return this.http.put<Aula>(`${this.apiUrl}/${_id}`, aula)
      .pipe(catchError(this.handleError));
  }

  deleteAula(_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${_id}`)
      .pipe(catchError(this.handleError));
  }
}
