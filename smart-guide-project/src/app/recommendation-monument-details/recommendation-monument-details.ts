import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Monument } from '../backend/reviews/model/MonumentModel.js'
import { Review } from '../backend/reviews/model/ReviewModel.js'
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import axios from 'axios'
import { AuthService } from '../auth-service'

@Component({
  selector: 'app-recommendation-monument-details',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recommendation-monument-details.html',
  styleUrl: './recommendation-monument-details.css',
})

export class RecommendationMonumentDetails {
  monument: Monument | null = null;
  monumentName: string | null = null;
  dataLoaded: boolean = false;
  monumentReviews: Review[] = [];

  authService = inject(AuthService);

  form = new FormGroup({
    reviewTitle: new FormControl('', { nonNullable: true }),
    reviewBody: new FormControl('', { nonNullable: true }),
    rating: new FormControl(0, { nonNullable: true })
  });

  http = inject(HttpClient);
  constructor(private route: ActivatedRoute, private changeRef: ChangeDetectorRef) {
    this.route.params.subscribe((params) => {
      this.monumentName = params['name'];
    });
  }

  fetchReviews() {
    const reviewsUrl = "http://localhost:3000/api/reviews/information/reviews";
    this.http.post<Review[]>(reviewsUrl, { id: this.monument?.buildingId }).subscribe({
      next: (data) => {
        this.monumentReviews = data as Review[];
        this.changeRef.detectChanges();
      },
      error: (err) => console.log(err)
    });
  }

  async ngOnInit() {
    const url = "http://localhost:3000/api/reviews/information/one";

    this.http.post<Monument>(url, { name: this.monumentName }).subscribe({
      next: (data) => {
        this.monument = data;
        this.dataLoaded = true;

        this.changeRef.detectChanges();

        this.fetchReviews();
      },
      error: (err) => console.error(err)
    });


  }

  refresh(): void {
    this.changeRef.detectChanges();
  }

  async submitReview() {

    const values = this.form.value;

    if (this.form.value.reviewTitle === "" || this.form.value.reviewBody === "") {
      return;
    }

    const userId = await this.authService.getId();

    try {
      const url = "http://localhost:3000/api/reviews/information/review";
      await axios.post(url, { userId, buildingId: this.monument?.buildingId, title: values.reviewTitle, description: values.reviewBody, rating: values.rating });
      this.changeRef.detectChanges();
      this.fetchReviews();
    } catch (error) {
      console.log(error);
    }
  }
}
