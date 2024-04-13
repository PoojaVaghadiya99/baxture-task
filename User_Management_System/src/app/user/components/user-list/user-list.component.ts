import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDTO } from '../../model/user.model'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {

  users: UserDTO[] = [];
  p: number = 1;
  itemsPerPage = 10;
  totalPages!: number;
  pages!: number[];
  displayedUsers: UserDTO[] = [];

  constructor(
    private userService: UserService,
    private _router: Router,
    protected _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userService.getUser()
      .subscribe({
        next: (result: UserDTO[]) => {
          this.users = result;
          this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.updateDisplayedUsers();
        },
        error: (err: any) => {
          console.error('There was an error!', err);
        },
      });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.p = page;
    this.updateDisplayedUsers();
  }

  updateDisplayedUsers() {
    const start = (this.p - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedUsers = this.users.slice(start, end);
  }

  deleteUser(id: string) {
    this.userService.getUserById(Number(id)).subscribe({
      next: (user: UserDTO) => {
        const confirmDelete = confirm(
          `Are you sure you want to delete below user ?\n
          First Name - ${user.first_name} ${user.last_name}
          Email - ${user.email}`
        );
        if (confirmDelete) {
          this.userService.deleteUser(Number(id)).subscribe({
            next: (result) => {
              console.log(result);
              this.users = this.users.filter(u => u.id !== user.id);
              this.updateDisplayedUsers();
            },
            error: (err) => console.error('Failed to delete user', err)
          });
        }
      },
      error: (err) => console.error('Failed to fetch user', err)
    });
  }

  goToForm(id: number) {
    if (id) {
      this._router.navigate(["/user-form", id]);
    } else {
      this._router.navigate(["/user-form", "0"]);
    }
  }

  editUser(id: string) {
    this.goToForm(Number(id));
  }

  addUser() {
    this.goToForm(0);
  }

}
