import { Routes } from '@angular/router';
import { ComponenteLogin } from './componentes/componente-login/componente-login';
import { ComponenteInicio } from './componentes/componente-inicio/componente-inicio';
import { ComponenteProfesores } from './componentes/componente-profesores/componente-profesores';
import { ComponenteCalendario } from './componentes/componente-calendario/componente-calendario';
import { ComponenteConfiguracion } from './componentes/componente-configuracion/componente-configuracion';
import { ComponenteClases } from './componentes/componente-clases/componente-clases';
import { ComponenteRegistro } from './componentes/registro/registro';
import { authGuard } from './guard-auth';

export const routes: Routes = [
  { path: 'login', component: ComponenteLogin },
  { path: 'registro', component: ComponenteRegistro },
  { path: 'inicio', component: ComponenteInicio, canActivate: [authGuard] },
  { path: 'profesores', component: ComponenteProfesores, canActivate: [authGuard] },
  { path: 'calendario', component: ComponenteCalendario, canActivate: [authGuard] },
  { path: 'configuracion', component: ComponenteConfiguracion, canActivate: [authGuard] },
  { path: 'clases', component: ComponenteClases, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
