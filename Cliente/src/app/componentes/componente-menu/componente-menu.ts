import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { GestionarUsuario } from '../../servicios/gestionar-usuario';

@Component({
  selector: 'app-componente-menu',
  standalone: true,
  imports: [MatMenuModule, RouterLink],
  templateUrl: './componente-menu.html',
  styleUrl: './componente-menu.css',
})
export class ComponenteMenu {
  private router = inject(Router);
  private auth = inject(GestionarUsuario);
  estaAutenticado = this.auth.estaAutenticado;
  esAdmin = this.auth.esAdmin;

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
