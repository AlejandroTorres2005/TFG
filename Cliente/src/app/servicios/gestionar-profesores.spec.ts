import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { GestionarProfesores } from './gestionar-profesores';

describe('GestionarProfesores', () => {
  let service: GestionarProfesores;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(GestionarProfesores);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
