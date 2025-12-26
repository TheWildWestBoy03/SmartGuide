import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Monument } from '../backend/reviews/model/MonumentModel.js';
import { AuthService } from '../auth-service'
import axios from 'axios'
import { User } from '../backend/authentication/model/User.js';
import { Itinerary } from '../backend/reviews/model/ItineraryModel.js';

interface ExtendedItineraryRepresentation {
  itineraryId: number,
  userId: number,
  numberOfBuildings: number,
  distance: number,
  ranking: number,
  optionBased: string,
  buildings: [String]
}

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})


export class HomePage {
  loggedInUser = false;
  admin = false;
  currentUser: User | null = null;
  systemUsers: User[] = [];
  userItineraries: ExtendedItineraryRepresentation[] = [];

  http = inject(HttpClient);
  authService: AuthService = inject(AuthService);
  constructor(private changeRef: ChangeDetectorRef) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getUserDetails();

    if (this.currentUser != null) {
      this.loggedInUser = true;
      this.admin = this.currentUser.isAdmin;

      this.changeRef.detectChanges();

      if (this.admin == true) {
        console.log("Admin");

        const usersRetrievalUrl = "http://localhost:3000/api/auth/"
        this.http.get<User[]>(usersRetrievalUrl).subscribe({
          next: (data) => {
            console.log(data);
            this.systemUsers = data;
            this.systemUsers = this.systemUsers.filter((user) => user.email !== "admin@gmail.com");

            this.changeRef.detectChanges();
          },
          error: (err) => console.error(err)
        });
      } else {
        const itinerariesRetrievalUrl = "http://localhost:3000/api/reviews/itineraries/get";
        const itinerariesResult = await axios.post(itinerariesRetrievalUrl, { userId: this.currentUser.userId }, { withCredentials: true });

        this.userItineraries = itinerariesResult.data as ExtendedItineraryRepresentation[];

        const itineraryBuildingsRetrievalUrl = "http://localhost:3000/api/reviews/itinerary-building/get";
        const itineraryBuildingPromises = this.userItineraries.map(itinerary => itinerary.itineraryId).map(itineraryId => {
          return axios.post(itineraryBuildingsRetrievalUrl, { itineraryId: itineraryId }, { withCredentials: true });
        });

        const result = await Promise.all(itineraryBuildingPromises);

        const userMonumentsResult = await axios.get("http://localhost:3000/api/reviews/information");
        const userMonuments: Monument[] = userMonumentsResult.data as Monument[];

        for (let i = 0; i < this.userItineraries.length; i++) {
          const currentItineraryBuildingsIds = result[i].data.map((building: any) => building.buildingId);
          const buildingsNames = currentItineraryBuildingsIds.map((currentId: any) => {
            const building: Monument[] = userMonuments.filter((monument) => monument.buildingId === currentId);
            return building[0].name;
          })

          this.userItineraries[i].buildings = buildingsNames;
          console.log(this.userItineraries[i].buildings);
        }

        this.changeRef.detectChanges();
      }
    }
  }

  async deleteUser(email: string) {
    this.systemUsers = this.systemUsers.filter((user) => user.email !== email);

    const deleteUserUrl = "http://localhost:3000/api/auth/delete";
    const result = await axios.post(deleteUserUrl, { email: email }, { withCredentials: true });

    console.log(result);
    this.changeRef.detectChanges();
  }
}
