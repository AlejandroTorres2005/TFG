import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Profesor } from '../../interfaces/profesor';
import { Clase } from '../../interfaces/clase';
import { Horario } from '../../interfaces/horario';
import { GestionarProfesores } from '../../servicios/gestionar-profesores';
import { GestionarClases } from '../../servicios/gestionar-clases';
import { GestionarHorarios } from '../../servicios/gestionar-horarios';

@Component({
  selector: 'app-componente-configuracion',
  imports: [FormsModule, CommonModule],
  templateUrl: './componente-configuracion.html',
  styleUrls: ['./componente-configuracion.css']
})
export class ComponenteConfiguracion implements OnInit {
  private gestionarProfesores = inject(GestionarProfesores);
  private gestionarClases = inject(GestionarClases);
  private gestionarHorarios = inject(GestionarHorarios);

  seccionActiva: 'profesores' | 'clases' | 'horarios' = 'profesores';

  profesores: Profesor[] = [];
  busquedaProfesores = '';
  get profesoresFiltrados() {
    return this.profesores.filter(p =>
      `${p.nombre} ${p.apellidos}`.toLowerCase().includes(this.busquedaProfesores.toLowerCase())
    );
  }
  clases: Clase[] = [];
  horarios: Horario[] = [];

  dias = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
  horasEF = ['9:30-10:15', '10:15-11:00', '11:00-11:45', '11:30-12:15', '12:15-13:00', '14:30-15:15', '15:15-16:00'];
  horasMusica = ['9:30-10:15', '10:15-11:00', '11:00-11:45', '12:15-13:00', '14:30-15:15', '15:15-16:00'];

  getCelda(asignatura: string, dia: string, hora: string): Horario[] {
    return this.horarios.filter(h => h.asignatura === asignatura && h.dia === dia && h.hora === hora);
  }

  formProfesor = false;
  formClase = false;
  formHorario = false;

  editandoProfesor = false;
  editandoClase = false;
  editandoHorario = false;

  indiceProfesor: number | null = null;
  indiceClase: number | null = null;
  indiceHorario: number | null = null;

  nuevoProfesor: Profesor = {
    nombre: '', apellidos: '', clases: [], foto: '',
    guardiasRealizadas: 0, horasLibres: [], email: '', telefono: undefined
  };
  nuevaClase: Clase = { nombre: '', profesor: '', horario: '' };
  nuevoHorario: Horario = { dia: 'LUNES', hora: '9:30-10:15', asignatura: 'EF', grupo: 0, profesor: '' };

  erroresProfesor: { [key: string]: string } = {};
  erroresClase: { [key: string]: string } = {};
  erroresHorario: { [key: string]: string } = {};

  horas = ['9:30-10:15', '10:15-11:00', '11:00-11:45', '11:30-12:15', '12:15-13:00', '14:30-15:15', '15:15-16:00'];

  fotoPreview: string | null = null;

  // Toast notifications
  toastVisible = false;
  toastMensaje = '';
  toastTipo: 'success' | 'error' | 'info' = 'success';

  // Confirm dialog
  confirmVisible = false;
  confirmMensaje = '';
  confirmAccion: (() => void) | null = null;

  ngOnInit() {
    this.cargarProfesores();
    this.cargarClases();
    this.cargarHorarios();
  }

  cargarProfesores() {
    this.gestionarProfesores.getProfesores().subscribe(datos => this.profesores = datos);
  }

  cargarClases() {
    this.gestionarClases.getClases().subscribe(datos => this.clases = datos);
  }

  cargarHorarios() {
    this.gestionarHorarios.getHorarios().subscribe(datos => this.horarios = datos);
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' | 'info' = 'success') {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 2500);
  }

  mostrarConfirmacion(mensaje: string, accion: () => void) {
    this.confirmMensaje = mensaje;
    this.confirmAccion = accion;
    this.confirmVisible = true;
  }

  ejecutarConfirmacion() {
    if (this.confirmAccion) this.confirmAccion();
    this.confirmVisible = false;
    this.confirmAccion = null;
  }

  cancelarConfirmacion() {
    this.confirmVisible = false;
    this.confirmAccion = null;
  }

  onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max = 800;
        let w = img.width, h = img.height;
        if (w > max || h > max) { if (w > h) { h = h * max / w; w = max; } else { w = w * max / h; h = max; } }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const data = canvas.toDataURL('image/jpeg', 0.7);
        this.nuevoProfesor.foto = data;
        this.fotoPreview = data;
      };
      const reader = new FileReader();
      reader.onload = () => img.src = reader.result as string;
      reader.readAsDataURL(input.files[0]);
    }
  }

  onClasesInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.nuevoProfesor.clases = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    this.erroresProfesor['clases'] = '';
  }

  quitarFoto() {
    this.nuevoProfesor.foto = '';
    this.fotoPreview = null;
  }

  mostrarFormularioProfesor() {
    this.formProfesor = true;
    this.erroresProfesor = {};
  }

  mostrarFormularioClase() {
    this.formClase = true;
    this.erroresClase = {};
  }

  validarProfesor(): boolean {
    this.erroresProfesor = {};
    if (!this.nuevoProfesor.nombre.trim()) this.erroresProfesor['nombre'] = 'El nombre es obligatorio';
    if (!this.nuevoProfesor.apellidos.trim()) this.erroresProfesor['apellidos'] = 'Los apellidos son obligatorios';
    if (this.nuevoProfesor.email && this.nuevoProfesor.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.nuevoProfesor.email))
      this.erroresProfesor['email'] = 'Email no válido';
    if (!this.nuevoProfesor.clases || this.nuevoProfesor.clases.length === 0) this.erroresProfesor['clases'] = 'Selecciona al menos una clase';
    return Object.keys(this.erroresProfesor).length === 0;
  }

  validarClase(): boolean {
    this.erroresClase = {};
    if (!this.nuevaClase.nombre.trim()) this.erroresClase['nombre'] = 'El nombre de la clase es obligatorio';
    if (!this.nuevaClase.profesor.trim()) this.erroresClase['profesor'] = 'El profesor es obligatorio';
    if (!this.nuevaClase.aula?.trim()) this.erroresClase['aula'] = 'El aula es obligatoria';
    if (!this.nuevaClase.horario.trim()) this.erroresClase['horario'] = 'El horario es obligatorio';
    return Object.keys(this.erroresClase).length === 0;
  }

  guardarProfesor() {
    if (!this.validarProfesor()) return;
    const obs = this.editandoProfesor && this.indiceProfesor !== null && this.profesores[this.indiceProfesor]._id
      ? this.gestionarProfesores.updateEquipo(this.profesores[this.indiceProfesor]._id!, this.nuevoProfesor)
      : this.gestionarProfesores.addEquipo(this.nuevoProfesor);
    obs.subscribe({
      next: () => {
        this.cargarProfesores();
        this.mostrarToast(this.editandoProfesor ? 'Profesor actualizado correctamente' : 'Profesor creado correctamente');
        this.resetFormProfesor();
      },
      error: (e) => { console.error('Error al guardar profesor:', e); this.mostrarToast('Error al guardar el profesor', 'error'); }
    });
  }

  resetFormProfesor() {
    this.nuevoProfesor = { nombre: '', apellidos: '', clases: [], foto: '', guardiasRealizadas: 0, horasLibres: [], email: '', telefono: undefined };
    this.fotoPreview = null;
    this.editandoProfesor = false;
    this.formProfesor = false;
    this.erroresProfesor = {};
  }

  editarProfesor(profesor: Profesor) {
    this.nuevoProfesor = { ...profesor };
    this.fotoPreview = profesor.foto || null;
    this.indiceProfesor = this.profesores.findIndex(p => p._id === profesor._id);
    this.editandoProfesor = true;
    this.formProfesor = true;
    this.erroresProfesor = {};
  }

  confirmarEliminarProfesor(id: string | undefined) {
    if (!id) return;
    this.mostrarConfirmacion('¿Estás seguro de que quieres eliminar este profesor?', () => {
      this.gestionarProfesores.deleteEquipo(id).subscribe({
        next: () => {
          this.cargarProfesores();
          this.mostrarToast('Profesor eliminado correctamente');
        },
        error: () => this.mostrarToast('Error al eliminar el profesor', 'error')
      });
    });
  }

  guardarClase() {
    if (!this.validarClase()) return;
    const obs = this.editandoClase && this.indiceClase !== null && this.clases[this.indiceClase]._id
      ? this.gestionarClases.updateClase(this.clases[this.indiceClase]._id!, this.nuevaClase)
      : this.gestionarClases.addClase(this.nuevaClase);
    obs.subscribe({
      next: () => {
        this.cargarClases();
        this.mostrarToast(this.editandoClase ? 'Clase actualizada correctamente' : 'Clase creada correctamente');
        this.resetFormClase();
      },
      error: () => this.mostrarToast('Error al guardar la clase', 'error')
    });
  }

  resetFormClase() {
    this.nuevaClase = { nombre: '', profesor: '', horario: '' };
    this.editandoClase = false;
    this.formClase = false;
    this.erroresClase = {};
  }

  editarClase(clase: Clase) {
    this.nuevaClase = { ...clase };
    this.indiceClase = this.clases.findIndex(c => c._id === clase._id);
    this.editandoClase = true;
    this.formClase = true;
    this.erroresClase = {};
  }

  confirmarEliminarClase(index: number) {
    this.mostrarConfirmacion('¿Estás seguro de que quieres eliminar esta clase?', () => {
      const id = this.clases[index]._id;
      if (id) {
        this.gestionarClases.deleteClase(id).subscribe({
          next: () => {
            this.cargarClases();
            this.mostrarToast('Clase eliminada correctamente');
          },
          error: () => this.mostrarToast('Error al eliminar la clase', 'error')
        });
      }
    });
  }

  mostrarFormularioHorario() {
    this.formHorario = true;
    this.erroresHorario = {};
  }

  validarHorario(): boolean {
    this.erroresHorario = {};
    if (!this.nuevoHorario.dia) this.erroresHorario['dia'] = 'El día es obligatorio';
    if (!this.nuevoHorario.hora) this.erroresHorario['hora'] = 'La hora es obligatoria';
    if (!this.nuevoHorario.asignatura) this.erroresHorario['asignatura'] = 'La asignatura es obligatoria';
    if (this.nuevoHorario.grupo === undefined || this.nuevoHorario.grupo === null) this.erroresHorario['grupo'] = 'El grupo es obligatorio';
    return Object.keys(this.erroresHorario).length === 0;
  }

  guardarHorario() {
    if (!this.validarHorario()) return;
    const obs = this.editandoHorario && this.indiceHorario !== null && this.horarios[this.indiceHorario]._id
      ? this.gestionarHorarios.updateHorario(this.horarios[this.indiceHorario]._id!, this.nuevoHorario)
      : this.gestionarHorarios.addHorario(this.nuevoHorario);
    obs.subscribe({
      next: () => {
        this.cargarHorarios();
        this.mostrarToast(this.editandoHorario ? 'Horario actualizado correctamente' : 'Horario creado correctamente');
        this.resetFormHorario();
      },
      error: () => this.mostrarToast('Error al guardar el horario', 'error')
    });
  }

  resetFormHorario() {
    this.nuevoHorario = { dia: 'LUNES', hora: '9:30-10:15', asignatura: 'EF', grupo: 0, profesor: '' };
    this.editandoHorario = false;
    this.formHorario = false;
    this.erroresHorario = {};
  }

  editarHorario(horario: Horario) {
    this.nuevoHorario = { ...horario };
    this.indiceHorario = this.horarios.findIndex(h => h._id === horario._id);
    this.editandoHorario = true;
    this.formHorario = true;
    this.erroresHorario = {};
  }

  confirmarEliminarHorario(horario: Horario) {
    this.mostrarConfirmacion('¿Estás seguro de que quieres eliminar este horario?', () => {
      const id = horario._id;
      if (id) {
        this.gestionarHorarios.deleteHorario(id).subscribe({
          next: () => {
            this.cargarHorarios();
            this.mostrarToast('Horario eliminado correctamente');
          },
          error: () => this.mostrarToast('Error al eliminar el horario', 'error')
        });
      }
    });
  }
}
