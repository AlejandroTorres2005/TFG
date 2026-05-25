import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Mensaje {
  texto: string;
  tipo: 'user' | 'bot';
  hora: number;
}

interface MensajeHistorial {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat-flotante',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './componente-chat-flotante.html',
  styleUrl: './componente-chat-flotante.css'
})
export class ComponenteChatFlotante {
  private n8nUrl = 'http://localhost:5678/webhook/chat';

  @ViewChild('messagesContainer') private msgContainer!: ElementRef;

  abierto = false;
  mensajes: Mensaje[] = [];
  historial: MensajeHistorial[] = [];
  mensajeActual = '';
  cargando = false;

  toggleChat() {
    this.abierto = !this.abierto;
    if (this.abierto && this.mensajes.length === 0) {
      this.mensajes.push({
        texto: '¡Hola! Pregúntame sobre horarios, profesores o guardias.',
        tipo: 'bot',
        hora: Date.now()
      });
    }
    setTimeout(() => this.scrollAbajo(), 50);
  }

  private scrollAbajo() {
    try {
      this.msgContainer.nativeElement.scrollTop = this.msgContainer.nativeElement.scrollHeight;
    } catch {}
  }

  async enviarMensaje() {
    const texto = this.mensajeActual.trim();
    if (!texto || this.cargando) return;

    this.mensajes.push({ texto, tipo: 'user', hora: Date.now() });
    this.historial.push({ role: 'user', content: texto });
    this.mensajeActual = '';
    this.cargando = true;

    try {
      const res = await fetch(this.n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: texto,
          historial: this.historial.slice(-10) // últimos 10 mensajes para no pasarse de tokens
        })
      });
      const data = await res.json();
      const respuesta = data.reply || 'No obtuve respuesta.';
      this.mensajes.push({ texto: respuesta, tipo: 'bot', hora: Date.now() });
      this.historial.push({ role: 'assistant', content: respuesta });
    } catch {
      this.mensajes.push({
        texto: 'Error al conectar con el asistente. ¿Está n8n corriendo?',
        tipo: 'bot',
        hora: Date.now()
      });
    }

    this.cargando = false;
    setTimeout(() => this.scrollAbajo(), 50);
  }
}