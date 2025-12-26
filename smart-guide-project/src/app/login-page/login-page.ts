import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
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
  incorrectPassword: boolean = false;
  userNotFound: boolean = false;

  form = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });
  constructor(private changeRef: ChangeDetectorRef) { }

  async onSubmit() {
    const loginUrl: string = "http://localhost:3000/api/auth/login";
    const formValues = this.form.value;

    try {
      const response = await axios.post(loginUrl, {
        email: formValues.email,
        password: formValues.password,
      }, { withCredentials: true });

      console.log(response);
      window.location.href = '/home';

    } catch (error: any) {
      if (error.response.status === 404) {
        this.userNotFound = true;
        this.incorrectPassword = false;

        console.log("Incorrect user");

        this.changeRef.detectChanges();
      } else if (error.response.status === 401) {
        this.incorrectPassword = true;
        this.userNotFound = false;

        console.log("Incorrect password");
        this.changeRef.detectChanges();
      }
    }
  }
}
