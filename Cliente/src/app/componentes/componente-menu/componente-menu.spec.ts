import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponenteMenu } from './componente-menu';

describe('ComponenteMenu', () => {
  let component: ComponenteMenu;
  let fixture: ComponentFixture<ComponenteMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteMenu],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
