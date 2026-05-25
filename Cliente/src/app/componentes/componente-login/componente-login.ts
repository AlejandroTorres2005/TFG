import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GestionarUsuario } from '../../servicios/gestionar-usuario';
import { GestionarProfesores } from '../../servicios/gestionar-profesores';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-componente-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './componente-login.html',
  styleUrl: './componente-login.css'
})
export class ComponenteLogin {
  private router = inject(Router);
  private auth = inject(GestionarUsuario);
  private gestionarProfesores = inject(GestionarProfesores);

  codigo = '';
  clave = '';
  errorMsg = '';
  cargando = false;
  mostrarClave = false;

  onSubmit() {
    console.log('onSubmit ejecutado');
    this.errorMsg = '';
    this.cargando = true;
    this.auth.login(this.codigo, this.clave).subscribe({
      next: () => {
        console.log('Login exitoso, navegando a /inicio');
        this.cargando = false;
        this.gestionarProfesores.getProfesores().subscribe();
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Error de conexión con el servidor';
      }
    });
  }
}
