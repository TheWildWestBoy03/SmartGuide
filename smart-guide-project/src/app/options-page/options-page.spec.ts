import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsPage } from './options-page';

describe('OptionsPage', () => {
  let component: OptionsPage;
  let fixture: ComponentFixture<OptionsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});