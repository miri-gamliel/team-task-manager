import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskBoardPage } from './task-board-page';

describe('TaskBoardPage', () => {
  let component: TaskBoardPage;
  let fixture: ComponentFixture<TaskBoardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskBoardPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskBoardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
