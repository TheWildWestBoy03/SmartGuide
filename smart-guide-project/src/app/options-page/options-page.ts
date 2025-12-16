import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Option } from '../backend/authentication/model/Option.js'
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-options-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './options-page.html',
  styleUrl: './options-page.css',
})

export class OptionsPage {
  options: Option[] = [];
  http = inject(HttpClient);

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
    const optionsRetrievalUrl = "http://localhost:3000/api/reviews/options";
    this.http.post<Option[]>(optionsRetrievalUrl, { userId: 1 }).subscribe({
      next: (data) => {
        this.options = data as Option[];
        console.log(this.options);
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => console.log(err)
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

    // Assign the new FormGroup
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

    console.log(this.historicalCategories.length);
    this.changeDetectorRef.detectChanges();
  }

  handleSaving() {
    this.addingOptions = false;

    const finalChoose = this.serializedOptions.concat(this.selectedValues);
    console.log(finalChoose);

    const optionalSavingUrl = "http://localhost:3000/api/reviews/options/save";

    this.http.post<Option[]>(optionalSavingUrl, { userId: 1, options: finalChoose}).subscribe({
      next: (data) => {
        this.options = data as Option[];
        console.log(this.options);
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => console.log(err)
    });

    this.changeDetectorRef.detectChanges();
    window.location.reload();
  }

  ngOnInit(): void {
    this.getUserOptions();
    this.changeDetectorRef.detectChanges();
  }
}