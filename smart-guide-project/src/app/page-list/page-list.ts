import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-page-list',
  imports: [CommonModule],
  templateUrl: './page-list.html',
  styleUrl: './page-list.css',
})

export class PageList {
  protected pages = [{title: "Recommendations", link: "recommendations"},
                   {title: "Itineraries", link: "itineraries"}, 
                   {title: "Sign In", link: "sign-in"}, 
                   {title: "Options", link: "options"}]; 
}