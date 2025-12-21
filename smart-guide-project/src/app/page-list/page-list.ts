import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import axios from 'axios';

@Component({
  selector: 'app-page-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './page-list.html',
  styleUrl: './page-list.css',
})

export class PageList {
  private breakpointObserver = inject(BreakpointObserver);
  loggedIn: boolean = false;
  // Define breakpoints
  private bPoint800px = '(max-width: 800px)';
  private bPoint600px = '(max-width: 600px)';
  public extendedNavbar: boolean = false;

  constructor(private changeRef: ChangeDetectorRef) {

  }

  protected screenState$: Observable<{ is800: boolean; is600: boolean }> = this.breakpointObserver
    .observe([this.bPoint800px, this.bPoint600px])
    .pipe(
      map((result) => ({
        is800: result.breakpoints[this.bPoint800px],
        is600: result.breakpoints[this.bPoint600px],
      })),

      tap((state) => {
        if (!state.is800) {
          this.extendedNavbar = false;
        }
      }),

      shareReplay(1)
    );

  protected loggedOutPages = [
    { title: 'Recommendations', link: 'recommendations' },
    { title: 'Itineraries', link: 'itineraries' },
    { title: 'Options', link: 'options' },
    { title: 'Log In', link: 'login' },
  ];

  protected loggedInPages = [
    { title: 'Recommendations', link: 'recommendations' },
    { title: 'Itineraries', link: 'itineraries' },
    { title: 'Options', link: 'options' },
    { title: 'Home', link: 'home' },
    { title: 'Log Out', link: 'home' },
  ];

  async ngOnInit() {
    const userStatusUrl = "http://localhost:3000/api/auth/status";

    try {
      const result = await axios.post(userStatusUrl, {}, { withCredentials: true });

      if (result.status === 201) {
        this.loggedIn = true;
        this.changeRef.detectChanges();
      }
    } catch (error) {
    }
  }

  toggleAppearance() {
    this.extendedNavbar = !this.extendedNavbar;
  }

  async logout() {
    try {
      console.log("logging out");
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });

      this.loggedIn = false;
      window.location.href = "home";

    } catch (error) {
      console.error('Logout failed', error);
    }
  }

  onPageClick(name: string) {
    if (name === 'Log Out') {
      this.logout();
    }
  }
}
