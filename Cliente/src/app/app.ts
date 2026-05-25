import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponenteMenu } from './componentes/componente-menu/componente-menu';
import { ComponenteChatFlotante } from './componentes/componente-chat-flotante/componente-chat-flotante';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ComponenteMenu, ComponenteChatFlotante],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Gestion Profesores');
}
