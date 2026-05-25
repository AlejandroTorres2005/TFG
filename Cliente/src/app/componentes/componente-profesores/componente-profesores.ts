import { GestionarProfesores } from '../../servicios/gestionar-profesores';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Profesor } from '../../interfaces/profesor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-componente-profesores',
  imports: [CommonModule, FormsModule],
  templateUrl: './componente-profesores.html',
  styleUrls: ['./componente-profesores.css'],
})
export class ComponenteProfesores {
  private gestionarProfesores = inject(GestionarProfesores);

  profesores: Profesor[] = [];
  busqueda = '';
  get profesoresFiltrados() {
    return this.profesores.filter(p =>
      `${p.nombre} ${p.apellidos}`.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }
  mostrarModal = false;
  profesorSeleccionado: Profesor | null = null;

  editandoProfesor: Profesor | null = null;
  mostrarFormEditar = false;
  fotoPreviewEdit: string | null = null;

  toastVisible = false;
  toastMensaje = '';
  toastTipo: 'success' | 'error' = 'success';

  confirmVisible = false;
  confirmMensaje = '';
  confirmAccion: (() => void) | null = null;

  ngOnInit() {
    this.getProfesores();
  }

  getProfesores(): void {
    this.gestionarProfesores.getProfesores().subscribe(datos => this.profesores = datos);
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
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

  verProfesor(profesor: Profesor) {
    this.profesorSeleccionado = profesor;
    this.mostrarModal = true;
  }

  cerrarVentana() {
    this.mostrarModal = false;
    this.profesorSeleccionado = null;
  }

  editarProfesor(profesor: Profesor) {
    this.editandoProfesor = { ...profesor };
    this.fotoPreviewEdit = profesor.foto || null;
    this.mostrarFormEditar = true;
  }

  cerrarFormEditar() {
    this.mostrarFormEditar = false;
    this.editandoProfesor = null;
    this.fotoPreviewEdit = null;
  }

  onClasesEditInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    if (this.editandoProfesor) {
      this.editandoProfesor.clases = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
  }

  onFotoEdit(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.editandoProfesor) {
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
        this.editandoProfesor!.foto = data;
        this.fotoPreviewEdit = data;
      };
      const reader = new FileReader();
      reader.onload = () => img.src = reader.result as string;
      reader.readAsDataURL(input.files[0]);
    }
  }

  guardarEdicion() {
    if (!this.editandoProfesor || !this.editandoProfesor._id) return;
    this.gestionarProfesores.updateEquipo(this.editandoProfesor._id, this.editandoProfesor).subscribe({
      next: () => {
        this.getProfesores();
        this.mostrarToast('Profesor actualizado correctamente');
        this.cerrarFormEditar();
      },
      error: () => this.mostrarToast('Error al actualizar', 'error')
    });
  }

  confirmarEliminar(profesor: Profesor) {
    this.mostrarConfirmacion('¿Estás seguro de que quieres eliminar este profesor?', () => {
      if (profesor._id) {
        this.gestionarProfesores.deleteEquipo(profesor._id).subscribe({
          next: () => {
            this.getProfesores();
            this.mostrarToast('Profesor eliminado correctamente');
          },
          error: () => this.mostrarToast('Error al eliminar', 'error')
        });
      }
    });
  }
}
