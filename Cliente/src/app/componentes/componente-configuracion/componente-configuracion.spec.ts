import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponenteConfiguracion } from './componente-configuracion';

describe('ComponenteConfiguracion', () => {
  let component: ComponenteConfiguracion;
  let fixture: ComponentFixture<ComponenteConfiguracion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteConfiguracion],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteConfiguracion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
