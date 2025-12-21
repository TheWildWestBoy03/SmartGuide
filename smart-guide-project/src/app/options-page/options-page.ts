import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Option } from '../backend/authentication/model/Option.js'
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import axios from 'axios'
import { AuthService } from '../auth-service'

@Component({
  selector: 'app-options-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './options-page.html',
  styleUrl: './options-page.css',
})

export class OptionsPage {
  authService = inject(AuthService);
  options: Option[] = [];
  http = inject(HttpClient);
  loggedIn: boolean = false;

  serializedOptions: string[] = [];
  differenceOptions: string[] = [];
  addingOptions: boolean = false;

  historicalCategories: string[] = [
    "Palaces & Royal Residences",
    "Orthodox Churches & Monasteries",
    "Cultural Buildings / Theaters / Museums",
    "Historic Houses & Villas",
    "Fortifications / Old Courts",
    "Monuments & Arches",
    "Princely Courts & Medieval Remains",
    "Brâncovenesc Style Architecture",
    "National/Interwar Period Banks & Financial Palaces",
    "Historic Inns & Caravanserais",
    "Neo-Romanian & Art Nouveau Residences",
    "Communist Era Monuments & Civic Structures"
  ];

  form = new FormGroup({});

  get selectedValues() {
    return this.differenceOptions.filter(opt => this.form.get(opt)?.value === true);
  }
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  async getUserOptions() {
    const userStatusUrl = "http://localhost:3000/api/auth/status";
    const userId = await this.authService.getId();

    const optionsRetrievalUrl = "http://localhost:3000/api/reviews/options";
    this.http.post<Option[]>(optionsRetrievalUrl, { userId }).subscribe({
      next: (data) => {
        this.options = data as Option[];
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => console.log("")
    });
  }

  drop(event: CdkDragDrop<Option[]>) {
    moveItemInArray(this.options, event.previousIndex, event.currentIndex);
  }

  handleAdding() {
    this.addingOptions = !this.addingOptions;

    this.serializedOptions = this.options.map((element) => element.name);
    this.differenceOptions = this.historicalCategories.filter((category) => {
      return !this.serializedOptions.includes(category)
    });

    const newControls = Object.fromEntries(
      this.differenceOptions.map(option => [option, new FormControl(false, { nonNullable: true })])
    );

    this.form = new FormGroup(newControls);

    this.changeDetectorRef.detectChanges();
  }

  handleDeleting(name : String) {
    this.options = this.options.filter((option) => option.name !== name);
    this.serializedOptions = this.options.map((element) => element.name);
    this.differenceOptions = this.historicalCategories.filter((category) => {
      return !this.serializedOptions.includes(category)
    });

    const newControls = Object.fromEntries(
      this.differenceOptions.map(option => [option, new FormControl(false, { nonNullable: true })])
    );

    // Assign the new FormGroup
    this.form = new FormGroup(newControls);

    this.changeDetectorRef.detectChanges();
  }

  async handleSaving() {
    this.addingOptions = false;

    const finalChoose = this.serializedOptions.concat(this.selectedValues);

    const optionalSavingUrl = "http://localhost:3000/api/reviews/options/save";
    const userId = await this.authService.getId();

    this.http.post<Option[]>(optionalSavingUrl, { userId, options: finalChoose}).subscribe({
      next: (data) => {
        this.options = data as Option[];
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => console.log("")
    });

    this.changeDetectorRef.detectChanges();
    window.location.reload();
  }

  async ngOnInit() {
    const userStatusUrl = "http://localhost:3000/api/auth/status";
    const result = await axios.post(userStatusUrl, {}, { withCredentials: true });

    if (result.status === 201) {
      this.loggedIn = true;
      this.getUserOptions();
      this.changeDetectorRef.detectChanges();
    }
  }

  loginButtonClick() {
    window.location.href = "/login";
  }
}
