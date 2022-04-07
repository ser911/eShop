import { User } from '../models/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiURLUsers = environment.apiURL + 'users';


  constructor(
    private http: HttpClient,
    private router: Router,
    private token: LocalstorageService
  ) { }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}/login`, { email, password });
  }


  logout() {
    this.token.removeToken();
    this.router.navigate(['/login']);
    console.log('logout');
    
  }

}
