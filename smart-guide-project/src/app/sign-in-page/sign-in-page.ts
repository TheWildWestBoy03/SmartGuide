import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import axios from 'axios';
// This imports all exports from 'axios' and puts them under the 'axios' namespace object.

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.css',
})

export class SignInPage {
  protected historicalOptions = [
    "Palaces & Royal Residences", "Orthodox Churches & Monasteries", 
    "Cultural Buildings / Theaters / Museums", "Historic Houses & Villas",
    "Fortifications / Old Courts", "Monuments & Arches"
  ];

  form = new FormGroup({
      firstname: new FormControl('', { nonNullable: true }),
      lastname: new FormControl('', { nonNullable: true }),
      email: new FormControl('', { nonNullable: true }),
      password: new FormControl('', { nonNullable: true }),

      ...Object.fromEntries(this.historicalOptions.map(
        option => [option, new FormControl(false, { nonNullable: true })]
      ))
    }
  );

  get selectedValues() {
    return this.historicalOptions.filter(opt => this.form.get(opt)?.value === true);
  }

  async onSubmit() {
    const authenticationUrl : string = "http://localhost:3000/api/auth/register";
    const formValues = this.form.value;

    try {
      const response = await axios.post(authenticationUrl, {
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        email: formValues.email,
        password: formValues.password,
        historicalInterests: this.selectedValues
      });

    } catch (error) {
      console.error(error);
    }
  }
}