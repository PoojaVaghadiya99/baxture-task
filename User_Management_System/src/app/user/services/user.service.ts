import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private _httpClient: HttpClient) { }

  getUser() {
    return this._httpClient.get(`https://6618e1169a41b1b3dfbe3066.mockapi.io/api/users`)
  }

}
