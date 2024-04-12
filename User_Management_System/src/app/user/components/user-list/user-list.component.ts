import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {

  users: any = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser().subscribe(data => {
      this.users = data;
      console.log(this.users)
    }, error => {
      console.error('There was an error!', error);
    });
  }

  editUser(id: number) {
    console.log('Editing user:', id);
  }

  deleteUser(id: number) {
    console.log('Deleting user:', id);
  }

}
