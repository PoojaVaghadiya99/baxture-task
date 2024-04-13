import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../model/user.model';

@Component({
  selector: 'app-user-upsert',
  templateUrl: './user-upsert.component.html',
  styleUrls: ['./user-upsert.component.css']
})

export class UserUpsertComponent implements OnInit {

  userForm!: FormGroup;
  isEdit: boolean = false;
  currentUserId?: string;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.isEdit = true;
        this.currentUserId = userId;
        this.userService.getUserById(Number(userId)).subscribe(user => {
          this.editForm(user);
        });
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
      address: data.address
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.valid) {
      if (this.isEdit) {
        this.userService.updateUser(this.userForm.value as UserDTO).subscribe(() => {
          this.router.navigate(['/user-list']);
        });
      } else {
        this.userService.addUser(this.userForm.value as UserDTO).subscribe(() => {
          this.router.navigate(['/user-list']);
        });
      }
    }
  }
}
