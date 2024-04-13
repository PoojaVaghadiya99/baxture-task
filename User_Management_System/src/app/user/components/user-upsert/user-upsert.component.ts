import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../model/user.model';

@Component({
  selector: 'app-user-upsert',
  templateUrl: './user-upsert.component.html',
  styleUrls: ['./user-upsert.component.css'],
})
export class UserUpsertComponent implements OnInit {
  userForm!: FormGroup;
  isEdit: boolean = false;
  currentUserId?: string;
  submitted: boolean = false;
  formTitle: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');
      if (userId) {
        if (Number(userId) === 0) {
          this.isEdit = false;
          this.formTitle = 'Add User';
        } else {
          this.isEdit = true;
          this.formTitle = 'Edit User';
          this.currentUserId = userId;
          this.isLoading = true;
          this.userService.getUserById(Number(userId)).subscribe({
            next: (user) => {
              this.editForm(user);
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
            },
          });
        }
      }
    });
  }

  createForm() {
    this.userForm = this.fb.group({
      id: [null],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
    });
  }

  editForm(data: UserDTO) {
    this.userForm.setValue({
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.valid) {
      this.isLoading = true;
      if (!this.isEdit) {
        this.userService.getUser().subscribe({
          next: (users) => {
            const existingUser = users.find(
              (user) => user.email === this.userForm.value.email
            );
            if (existingUser) {
              this.isLoading = false;
              const editResponse = window.confirm(
                'This email is already in use. Do you want to edit the existing user instead?'
              );
              if (editResponse) {
                this.isEdit = true;
                this.currentUserId = existingUser.id;
                this.formTitle = 'Edit User';
                this.editForm(existingUser);
              }
            } else {
              const addResponse = window.confirm(
                'Do you want to add this new user?'
              );
              if (addResponse) {
                this.processFormSubmission();
              } else {
                this.isLoading = false;
              }
            }
          },
          error: () => {
            this.isLoading = false;
          },
        });
      } else {
        const updateResponse = window.confirm(
          'Are you sure you want to update this user?'
        );
        if (updateResponse) {
          this.processFormSubmission();
        } else {
          this.isLoading = false;
        }
      }
    } else {
      this.isLoading = false;
    }
  }

  private processFormSubmission(): void {
    if (this.isEdit) {
      this.userService.updateUser(this.userForm.value as UserDTO).subscribe({
        next: () => {
          this.router.navigate(['/user-list']);
          alert('User updated successfully!');
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.userService.addUser(this.userForm.value as UserDTO).subscribe({
        next: () => {
          this.router.navigate(['/user-list']);
          alert('User added successfully!');
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
