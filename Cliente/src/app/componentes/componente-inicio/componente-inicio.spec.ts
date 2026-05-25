import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ComponenteInicio } from './componente-inicio';

describe('ComponenteInicio', () => {
  let component: ComponenteInicio;
  let fixture: ComponentFixture<ComponenteInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteInicio],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteInicio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
