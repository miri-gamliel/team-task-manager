import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsCard } from './teams-card';

describe('TeamsCard', () => {
  let component: TeamsCard;
  let fixture: ComponentFixture<TeamsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
