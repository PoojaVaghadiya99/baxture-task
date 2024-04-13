import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  apiUrl: string = `https://6618e1169a41b1b3dfbe3066.mockapi.io/api/users`;

  constructor(private _httpClient: HttpClient) { }

  getUser(): Observable<UserDTO[]> {
    return this._httpClient.get<UserDTO[]>(this.apiUrl);
  }

  updateUser(userData: UserDTO): Observable<UserDTO> {
    return this._httpClient.put<UserDTO>(`${this.apiUrl}/${userData.id}`, userData);
  }

  addUser(userData: UserDTO): Observable<UserDTO> {
    return this._httpClient.post<UserDTO>(this.apiUrl, userData);
  }

  getUserById(id: number): Observable<UserDTO> {
    return this._httpClient.get<UserDTO>(`${this.apiUrl}/${id}`);
  }

}

