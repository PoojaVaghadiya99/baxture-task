import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Base URL
  apiUrl: string = `https://6618e1169a41b1b3dfbe3066.mockapi.io/api/users`;

  constructor(private _httpClient: HttpClient) { }

  // Get All User
  getUser(): Observable<UserDTO[]> {
    return this._httpClient.get<UserDTO[]>(this.apiUrl);
  }

  // Get User By ID
  getUserById(id: number): Observable<UserDTO> {
    return this._httpClient.get<UserDTO>(`${this.apiUrl}/${id}`);
  }

  // Update User
  updateUser(userData: UserDTO): Observable<UserDTO> {
    return this._httpClient.put<UserDTO>(`${this.apiUrl}/${userData.id}`, userData);
  }

  // Add User
  addUser(userData: UserDTO): Observable<UserDTO> {
    return this._httpClient.post<UserDTO>(this.apiUrl, userData);
  }

  // Delete User
  deleteUser(id: number): Observable<UserDTO> {
    return this._httpClient.delete<UserDTO>(`${this.apiUrl}/${id}`);
  }
}
