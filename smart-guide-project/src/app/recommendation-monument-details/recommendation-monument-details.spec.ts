import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationMonumentDetails } from './recommendation-monument-details';

describe('RecommendationMonumentDetails', () => {
  let component: RecommendationMonumentDetails;
  let fixture: ComponentFixture<RecommendationMonumentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationMonumentDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationMonumentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
