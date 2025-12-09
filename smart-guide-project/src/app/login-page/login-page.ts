import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})

export class LoginPage {
  form = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });

  async onSubmit() {
    const loginUrl: string = "http://localhost:3000/api/auth/login";
    const formValues = this.form.value;

    try {
      const response = await axios.post(loginUrl, {
        email: formValues.email,
        password: formValues.password,
      });

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
}