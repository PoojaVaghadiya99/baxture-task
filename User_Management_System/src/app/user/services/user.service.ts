import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  apiUrl:string = `https://6618e1169a41b1b3dfbe3066.mockapi.io/api/users`;

  constructor(private _httpClient: HttpClient) { }

  getUser(): Observable<any>  {
    return this._httpClient.get(`${this.apiUrl}`)
  }

  updateUser(userData: any): Observable<any> {
    return this._httpClient.put(`${this.apiUrl}/${userData.id}`, userData);
  }

  addUser(userData: any): Observable<any> {
    return this._httpClient.post(`${this.apiUrl}`, userData);
  }

  getUserById(id:any): Observable<any> {
    return this._httpClient.get(`${this.apiUrl}/`,id)
  }

}
