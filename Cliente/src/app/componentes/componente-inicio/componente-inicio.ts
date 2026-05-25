import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { GestionarUsuario } from '../../servicios/gestionar-usuario';

@Component({
  selector: 'componente-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './componente-inicio.html',
  styleUrls: ['./componente-inicio.css']
})
export class ComponenteInicio {
  private auth = inject(GestionarUsuario);
  private router = inject(Router);

  menuItems = [
    {
      texto: 'Ver profesores',
      ruta: '/profesores',
      imagen: '../../../../../Fotos/Profesor.png'
    },
    {
      texto: 'Ver clases',
      ruta: '/clases',
      imagen: '../../../../../Fotos/Clase.png'
    },
    {
      texto: 'Ver calendario',
      ruta: '/calendario',
      imagen: '../../../../../Fotos/Calendario.png'
    },
    {
      texto: 'Configuracion',
      ruta: '/configuracion',
      imagen: '../../../../../Fotos/Configuracion.png'
    },
    {
      texto: 'Cerrar Sesión',
      ruta: '/sesion',
      imagen: '../../../../../Fotos/Salir.png'
    }
  ];

  cerrarSesion(event: Event) {
    event.preventDefault();
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login'])
    });
  }
}
