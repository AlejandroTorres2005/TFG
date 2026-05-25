import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponenteClases } from './componente-clases';

describe('ComponenteClases', () => {
  let component: ComponenteClases;
  let fixture: ComponentFixture<ComponenteClases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteClases],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteClases);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
