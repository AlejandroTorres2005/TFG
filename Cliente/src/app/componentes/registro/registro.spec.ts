import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponenteRegistro } from './registro';

describe('ComponenteRegistro', () => {
  let component: ComponenteRegistro;
  let fixture: ComponentFixture<ComponenteRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteRegistro],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
