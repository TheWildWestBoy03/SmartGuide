import { Component, signal } from '@angular/core';
import { RouterModule, Router, NavigationEnd, RouterOutlet} from '@angular/router';
import { PageList } from './page-list/page-list';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageList, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('smart-guide-project');
  showHeader : boolean = false;

  constructor(private router : Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(event => this.modifyHeader(event))
  }

  modifyHeader(location : NavigationEnd) {
    if (location.url === '/sign-in' || location.url === '/login') {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }
  }
}