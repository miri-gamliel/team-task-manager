import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectDialog } from './create-project-dialog';

describe('CreateProjectDialog', () => {
  let component: CreateProjectDialog;
  let fixture: ComponentFixture<CreateProjectDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProjectDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProjectDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
