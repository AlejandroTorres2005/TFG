import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GestionarHorarios } from '../../servicios/gestionar-horarios';
import type { CalendarOptions } from '@fullcalendar/core/index.js';

@Component({
  selector: 'app-componente-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './componente-calendario.html',
  styleUrl: './componente-calendario.css',
})
export class ComponenteCalendario {
  private gestionarHorarios = inject(GestionarHorarios);

  selectedDateStr = '';
  selectedDateLabel = '';
  clasesDelDia: { hora: string; profesor: string; asignatura: string }[] = [];
  filtroAsignatura = 'todas';
  todosLosEventos: any[] = [];
  mapaDias: Record<string, number> = { 'LUNES': 1, 'MARTES': 2, 'MIÉRCOLES': 3, 'JUEVES': 4, 'VIERNES': 5 };
  meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  diasSemana = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  get clasesFiltradas() {
    if (this.filtroAsignatura === 'todas') return this.clasesDelDia;
    return this.clasesDelDia.filter(c => c.asignatura === this.filtroAsignatura);
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    firstDay: 1,
    hiddenDays: [0, 6],
    height: 'auto',
    dayMaxEvents: true,
    selectable: true,
    dateClick: (arg) => this.onDateClick(arg),
    select: (arg) => this.onDateClick(arg),
    unselectAuto: false,
    events: [],
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    dayCellDidMount: (arg) => {
      if (!this.todosLosEventos.length) return;
      const frame = arg.el.querySelector('.fc-daygrid-day-frame') || arg.el;
      if (frame.querySelector('.cell-hint')) return;
      const ds = arg.date.toISOString().slice(0, 10);
      if (!this.todosLosEventos.some((e: any) => e.start.startsWith(ds))) return;
      const hint = document.createElement('div');
      hint.className = 'cell-hint';
      const img = document.createElement('img');
      img.src = '/Fotos/imagenCalendario.png';
      img.className = 'cell-hint-img';
      img.alt = 'clases';
      hint.appendChild(img);
      frame.appendChild(hint);
    }
  };

  ngOnInit() {
    this.gestionarHorarios.getHorarios().subscribe(datos => {
      const hoy = new Date();
      const year = hoy.getFullYear();
      const month = hoy.getMonth();
      const ultimoDia = new Date(year, month + 1, 0).getDate();
      this.todosLosEventos = [];
      const indicadores: any[] = [];
      const vistos = new Set<string>();

      for (const h of datos) {
        const diaSemana = this.mapaDias[h.dia];
        if (diaSemana === undefined) continue;
        const [horaInicio, horaFin] = h.hora.split('-');
        if (!horaInicio || !horaFin) continue;

        for (let d = 1; d <= ultimoDia; d++) {
          const fecha = new Date(year, month, d);
          if (fecha.getDay() === diaSemana) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const startStr = `${dateStr}T${horaInicio}:00`;
            const endStr = `${dateStr}T${horaFin}:00`;

            this.todosLosEventos.push({
              title: h.profesor || '—',
              start: startStr,
              end: endStr,
              asignatura: h.asignatura
            });

            const key = `${dateStr}-${h.asignatura}`;
            if (!vistos.has(key)) {
              vistos.add(key);
              indicadores.push({
                title: '',
                start: startStr,
                end: endStr,
                display: 'background',
                className: h.asignatura === 'EF' ? 'bg-ef' : 'bg-musica'
              });
            }
          }
        }
      }

      this.calendarOptions = { ...this.calendarOptions, events: indicadores };
      this.agregarHints();
    });
  }

  private agregarHints(intentos = 0) {
    if (intentos > 5) return;
    const cells = document.querySelectorAll('.fc-daygrid-day');
    if (!cells.length) { setTimeout(() => this.agregarHints(intentos + 1), 80); return; }
    cells.forEach(cell => {
      const ds = (cell as HTMLElement).getAttribute('data-date');
      if (!ds || !this.todosLosEventos.some((e: any) => e.start.startsWith(ds))) return;
      const frame = cell.querySelector('.fc-daygrid-day-frame');
      if (!frame || frame.querySelector('.cell-hint')) return;
      const hint = document.createElement('div');
      hint.className = 'cell-hint';
      const img = document.createElement('img');
      img.src = '/Fotos/imagenCalendario.png';
      img.className = 'cell-hint-img';
      img.alt = 'clases';
      hint.appendChild(img);
      frame.appendChild(hint);
    });
  }

  onDateClick(arg: any) {
    this.selectedDateStr = arg.dateStr || arg.startStr;
    const fecha = new Date(this.selectedDateStr + 'T12:00:00');
    const diaSem = this.diasSemana[fecha.getDay()];
    this.selectedDateLabel = `${diaSem}, ${fecha.getDate()} de ${this.meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    this.clasesDelDia = this.todosLosEventos
      .filter((e: any) => e.start && e.start.startsWith(this.selectedDateStr))
      .map((e: any) => {
        const inicio = e.start.split('T')[1]?.slice(0, 5) || '';
        const fin = e.end?.split('T')[1]?.slice(0, 5) || '';
        return { hora: `${inicio} - ${fin}`, profesor: e.title, asignatura: e.asignatura || '' };
      })
      .sort((a, b) => {
        const mins = (h: string) => { const [hh, mm] = h.split(':').map(Number); return hh * 60 + mm; };
        return mins(a.hora.split(' - ')[0]) - mins(b.hora.split(' - ')[0]);
      });
    this.filtroAsignatura = 'todas';
  }
}
