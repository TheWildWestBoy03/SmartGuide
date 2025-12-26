import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { User } from './backend/authentication/model/User'
interface AuthResponse {
  email: string;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private cachedEmail: string | null = null;
  private statusUrl = 'http://localhost:3000/api/auth/status';
  private cachedId: number | null = null;
  constructor() { }

  async getEmail(): Promise<string | null> {
    if (this.cachedEmail) {
      return this.cachedEmail;
    }

    try {
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(this.statusUrl, {}, { withCredentials: true })
      );

      this.cachedEmail = response.email;
      return this.cachedEmail;

    } catch (error) {
      this.cachedEmail = null;
      return null;
    }
  }

  async getId(): Promise<number | null> {
    if (this.cachedId) {
      return this.cachedId;
    }

    this.cachedEmail = await this.getEmail();

    try {
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(this.statusUrl, {}, { withCredentials: true })
      );

      const idRetrievalUrl = "http://localhost:3000/api/auth/get-user";
      const idResponse = await lastValueFrom(
        this.http.post<AuthResponse>(idRetrievalUrl, { email: this.cachedEmail })
      );

      const savedId = idResponse as unknown;
      this.cachedId = savedId as number ?? null;
      return this.cachedId;

    } catch (error) {
      this.cachedEmail = null;
      return null;
    }
  }

  async getUserDetails(): Promise<User | null> {
    if (!this.cachedId) {
      this.cachedId = await this.getId();
    }

    const userRetrievalUrl = "http://localhost:3000/api/auth/user-retrieve";
    const response = await lastValueFrom(
      this.http.post<AuthResponse>(userRetrievalUrl, { userId: this.cachedId }, { withCredentials: true })
    );

    const user: any = response;

    return user as User;
  }

  logout() {
    this.cachedEmail = null;
  }
}
