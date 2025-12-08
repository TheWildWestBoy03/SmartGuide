import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItinerariesPage } from './itineraries-page';

describe('ItinerariesPage', () => {
  let component: ItinerariesPage;
  let fixture: ComponentFixture<ItinerariesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItinerariesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItinerariesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});