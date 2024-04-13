import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDTO } from '../../model/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: UserDTO[] = [];
  p: number = 1;
  itemsPerPage = 10;
  totalPages!: number;
  pages!: number[];
  displayedUsers: UserDTO[] = [];
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private _router: Router,
    protected _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.isLoading = true;
    this.userService.getUser().subscribe({
      next: (result: UserDTO[]) => {
        this.users = result;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('There was an error!', err);
        this.isLoading = false;
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.p = page;
    this.getUsers();
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
              console.log('User deleted:', result);
              this.users = this.users.filter((u) => u.id !== user.id);
              this.getUsers();
              this.p = 1;
            },
            error: (err) => {
              console.error('Failed to delete user', err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Failed to fetch user', err);
      },
    });
  }

  goToForm(id: number) {
    if (id) {
      this._router.navigate(['/user-form', id]);
    } else {
      this._router.navigate(['/user-form', '0']);
    }
  }

  editUser(id: string) {
    this.goToForm(Number(id));
  }

  addUser() {
    this.goToForm(0);
  }
}
