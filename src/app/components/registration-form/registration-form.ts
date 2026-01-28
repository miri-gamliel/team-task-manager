import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.css',
})
export class RegistrationForm implements OnInit{
  
  private router = inject(Router);
  errorMessage = signal<string | null>(null);
  authService = inject(AuthService);

  userForm: FormGroup;

 constructor(private fb: FormBuilder) {
 this.userForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
  email: ['', [Validators.required,Validators.email]],
  password: ['', [Validators.required,Validators.minLength(6), Validators.maxLength(20),Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9]).+$')]]
 });
 }

 ngOnInit() {}

 onSubmit() {
 console.log('Submitted:', this.userForm.value);
 this.authService.register(this.userForm.value).subscribe({
  next: (user) => {
    console.log('registration successful:', user);
    this.errorMessage.set(null);
    this.router.navigate(['/teams']); 
 },
  error: (error) => { 
    console.error('registration failed:', error);
    this.errorMessage.set(error.message || 'אימייל כבר קיים במערכת');
  }
});
}

}
