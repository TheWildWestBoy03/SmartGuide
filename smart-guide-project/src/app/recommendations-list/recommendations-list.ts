import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Monument } from '../backend/reviews/model/MonumentModel.js';

@Component({
  selector: 'app-recommendations-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recommendations-list.html',
  styleUrl: './recommendations-list.css',
})

export class RecommendationsList implements OnInit {
  http = inject(HttpClient);

  monumentRecommendations: Monument[] = [];
  dataLoaded: boolean = false;

  constructor(private changeRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    const url = "http://localhost:3000/api/reviews/information";

    this.http.get<Monument[]>(url).subscribe({
      next: (data) => {
        this.monumentRecommendations = data;
        console.log("Render me");
        this.dataLoaded = true;
        this.changeRef.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}
