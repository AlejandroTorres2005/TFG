import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponenteProfesores } from './componente-profesores';

describe('ComponenteProfesores', () => {
  let component: ComponenteProfesores;
  let fixture: ComponentFixture<ComponenteProfesores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteProfesores],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteProfesores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
