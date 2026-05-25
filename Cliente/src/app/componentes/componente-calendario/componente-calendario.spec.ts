import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponenteCalendario } from './componente-calendario';

describe('ComponenteCalendario', () => {
  let component: ComponenteCalendario;
  let fixture: ComponentFixture<ComponenteCalendario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteCalendario],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteCalendario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
