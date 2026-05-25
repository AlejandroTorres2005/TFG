export interface Profesor {
  _id?: string;
  nombre: string;
  apellidos: string;
  clases: string[];
  foto: string;
  guardiasRealizadas: number;
  horasLibres: Array<string>;
  email?: string;
  telefono?: number;
}
