import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
  users: any = [];
  p: number = 1;
  itemsPerPage = 10;
  totalPages!: number;
  pages!: number[];

  displayedUsers: any = []; // This will hold the users for the current page.

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser().subscribe(data => {
      this.users = data;
      this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
      this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
      this.updateDisplayedUsers();
    }, error => {
      console.error('There was an error!', error);
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return; // prevent turning pages out of bounds
    }
    this.p = page;
    this.updateDisplayedUsers();
  }

  updateDisplayedUsers() {
    const start = (this.p - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedUsers = this.users.slice(start, end);
  }

  editUser(id: number) {
    console.log('Editing user:', id);
  }

  deleteUser(id: number) {
    console.log('Deleting user:', id);
  }

}
