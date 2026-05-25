import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Horario } from '../interfaces/horario';

@Injectable({
  providedIn: 'root'
})
export class GestionarHorarios {
  private apiUrl = 'http://localhost:3000/horarios';
  private cache: Horario[] | null = null;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error en el cliente:', error.error.message);
      return throwError(() => 'No se pudo conectar con el servidor.');
    } else {
      console.error(`Error en el servidor ${error.status}:`, error.error);
      return throwError(() => `Error del servidor: ${error.message}`);
    }
  }

  getHorarios(): Observable<Horario[]> {
    if (this.cache) return of(this.cache);
    return this.http.get<Horario[]>(this.apiUrl)
      .pipe(tap(datos => this.cache = datos), catchError(this.handleError));
  }

  getHorariosPorDia(dia: string): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/dia/${dia}`)
      .pipe(catchError(this.handleError));
  }

  addHorario(horario: Horario): Observable<Horario> {
    this.cache = null;
    return this.http.post<Horario>(this.apiUrl, horario)
      .pipe(catchError(this.handleError));
  }

  updateHorario(_id: string, horario: Horario): Observable<Horario> {
    this.cache = null;
    return this.http.put<Horario>(`${this.apiUrl}/${_id}`, horario)
      .pipe(catchError(this.handleError));
  }

  deleteHorario(_id: string): Observable<any> {
    this.cache = null;
    return this.http.delete(`${this.apiUrl}/${_id}`)
      .pipe(catchError(this.handleError));
  }
}
