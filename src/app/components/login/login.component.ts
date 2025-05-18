import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  @Output() loginEvent = new EventEmitter<boolean>();

  constructor(private _userService: UserService, private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      username: [''],
      password: [''],
    });
  }

  signIn(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.value;

    this._userService.logIn(credentials).subscribe({
      next: (response) => {
        const authHeader = response.headers.get('Authorization');
        if (authHeader) {
          localStorage.setItem('token', authHeader);
          this.loginEvent.emit(true);
        } else {
          console.warn('Authorization header missing in response.');
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
