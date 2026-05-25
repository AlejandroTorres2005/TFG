import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponenteLogin } from './componente-login';

describe('ComponenteLogin', () => {
  let component: ComponenteLogin;
  let fixture: ComponentFixture<ComponenteLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteLogin],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
