import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-upsert',
  templateUrl: './user-upsert.component.html',
  styleUrls: ['./user-upsert.component.css']
})

export class UserUpsertComponent implements OnInit {
  userForm!: FormGroup;
  users: any[] = [];
  nextId = 0;
  submitted = false; 
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  
  ) {}

  
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.isEdit = true;
        this.userService.getUserById(userId).subscribe(user => {
          this.userForm.patchValue(user);
        });
      }
    });


    
  }

  createForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], 
      address: this.fb.group({
        street: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['']
      })
    });
  }

  onSubmit(): void {
    this.submitted = true; // Mark form as submitted
    if (this.userForm.valid) {
      const newUser = { id: this.nextId++, ...this.userForm.value };
      const index = this.users.findIndex(user => user.email === this.userForm.value.email);
      if (index === -1) {
        this.users.push(newUser);
      } else {
        this.users[index] = { ...this.users[index], ...newUser };
      }
      console.log(this.users);
      this.userForm.reset();
      this.submitted = false; // Reset submission status
    }
  }

  saveUser(): void {
    if (this.userForm.valid) {
      if (this.isEdit) {
        this.userService.updateUser(this.userForm.value).subscribe(() => {
          this.router.navigate(['/success-path']); // Adjust the navigation path as necessary
        });
      } else {
        this.userService.addUser(this.userForm.value).subscribe(() => {
          this.router.navigate(['/success-path']); // Adjust the navigation path as necessary
        });
      }
    }
  }
}