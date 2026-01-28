import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm implements OnInit {

  private router = inject(Router);
  errorMessage = signal<string | null>(null);
  authService = inject(AuthService);

  userForm: FormGroup;

 constructor(private fb: FormBuilder) {
 this.userForm = this.fb.group({
  email: ['', [Validators.required,Validators.email]],
  password: ['', [Validators.required,Validators.minLength(6), Validators.maxLength(20),Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9]).+$')]]
 });
 }

 ngOnInit() {}

 onSubmit() {
 console.log('Submitted:', this.userForm.value);
 this.authService.login(this.userForm.value).subscribe({
  next: (user) => {
    console.log('Login successful:', user);
    this.errorMessage.set(null);
    this.router.navigate(['/teams']); 
 },
  error: (error) => { 
    console.error('Login failed:', error);
    this.errorMessage.set(error.message || 'אימייל או סיסמה שגויים');
  }
});
}

}

