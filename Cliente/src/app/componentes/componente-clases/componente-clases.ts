import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionarClases } from '../../servicios/gestionar-clases';
import { Clase } from '../../interfaces/clase';

@Component({
  selector: 'app-componente-clases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './componente-clases.html',
  styleUrl: './componente-clases.css',
})
export class ComponenteClases {
  private gestionarClases = inject(GestionarClases);
  clases: Clase[] = [];

  ngOnInit() {
    this.gestionarClases.getClases().subscribe(datos => this.clases = datos);
  }
}
