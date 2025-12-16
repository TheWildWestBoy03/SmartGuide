import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core'; // Removed OnInit, ChangeDetectorRef
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page-list',
  imports: [CommonModule], // Ensure CommonModule is here for the async pipe
  standalone: true,
  templateUrl: './page-list.html',
  styleUrl: './page-list.css',
})

export class PageList {
  private breakpointObserver = inject(BreakpointObserver);

  // Define breakpoints
  private bPoint800px = '(max-width: 800px)';
  private bPoint600px = '(max-width: 600px)';
  public extendedNavbar : boolean = false;

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

  protected pages = [
    { title: 'Recommendations', link: 'recommendations' },
    { title: 'Itineraries', link: 'itineraries' },
    { title: 'Sign In', link: 'sign-in' },
    { title: 'Options', link: 'options' },
  ];

  toggleAppearance() {
    this.extendedNavbar = !this.extendedNavbar;
  }
}
