import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { GestionarUsuario } from './gestionar-usuario';

describe('GestionarUsuarios', () => {
  let service: GestionarUsuario;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(GestionarUsuario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
