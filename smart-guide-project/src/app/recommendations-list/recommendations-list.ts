import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Monument } from '../backend/reviews/model/MonumentModel.js';
import { AuthService } from '../auth-service'
import axios from 'axios'

@Component({
  selector: 'app-recommendations-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recommendations-list.html',
  styleUrl: './recommendations-list.css',
})

export class RecommendationsList implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);

  loggedIn: boolean = false;
  monumentRecommendations: Monument[] = [];
  dataLoaded: boolean = false;

  constructor(private changeRef: ChangeDetectorRef) {

  }

  async ngOnInit() {
    const url = "http://localhost:3000/api/reviews/monument-by-user";
    const userStatusUrl = "http://localhost:3000/api/auth/status";

    try {
      const result = await axios.post(userStatusUrl, {}, { withCredentials: true });
 
      if (result.status === 201) {
        this.loggedIn = true;
        console.log(result.data.email)

        this.http.post<Monument[]>(url, {email: result.data.email}).subscribe({
          next: (data) => {
            console.log(data);
            this.monumentRecommendations = data;
            this.dataLoaded = true;
            this.changeRef.detectChanges();
          }, 
          error: (err) => console.error(err)
        });
      } else {
        console.log("Unauthorized")
      }
    } catch (error) {
    }
  }

  loginButtonClick() {
    window.location.href = "/login";
  }
}
