import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration-form',
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.css',
  standalone: true
})
export class RegistrationForm implements OnInit {
  
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  userForm: FormGroup;
  hidePassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9]).+$')
      ]]
    });
  }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }

  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    
    if (!field || !field.touched || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} הוא שדה חובה`;
    }
    
    if (fieldName === 'name') {
      if (field.errors['minlength']) return 'השם צריך להיות לפחות 2 תווים';
      if (field.errors['maxlength']) return 'השם לא יכול להיות יותר מ-30 תווים';
    }
    
    if (fieldName === 'email' && field.errors['email']) {
      return 'כתובת אימייל לא תקינה';
    }
    
    if (fieldName === 'password') {
      if (field.errors['minlength']) return 'הסיסמה צריכה להיות לפחות 6 תווים';
      if (field.errors['maxlength']) return 'הסיסמה לא יכולה להיות יותר מ-20 תווים';
      if (field.errors['pattern']) return 'הסיסמה חייבת להכיל אותיות וספרות';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'שם',
      email: 'אימייל',
      password: 'סיסמה'
    };
    return labels[fieldName] || fieldName;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.userForm.value).subscribe({
      next: (user) => {
        console.log('ההרשמה הצליחה:', user);
        this.isLoading.set(false);
        this.snackBar.open('ההרשמה בוצעה בהצלחה! מעביר אותך...', 'סגור', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        setTimeout(() => {
          this.router.navigate(['/teams']);
        }, 1000);
      },
      error: (error) => {
        console.error('ההרשמה נכשלה:', error);
        this.isLoading.set(false);
        
        let errorMsg = 'שגיאה בהרשמה. אנא נסה שוב';
        
        if (error.status === 409) {
          errorMsg = 'האימייל כבר קיים במערכת';
        } else if (error.status === 400) {
          errorMsg = 'פרטים לא תקינים. אנא בדוק את הנתונים';
        } else if (error.status === 500) {
          errorMsg = 'שגיאת שרת. אנא נסה שוב מאוחר יותר';
        } else if (error.status === 0) {
          errorMsg = 'אין חיבור לשרת. אנא בדוק את החיבור לאינטרנט';
        }
        
        this.errorMessage.set(errorMsg);
        this.snackBar.open(errorMsg, 'סגור', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}