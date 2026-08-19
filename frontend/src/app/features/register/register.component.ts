import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);

  registerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phoneNumber: ['', Validators.required]
  });

  constructor(
    private router: Router,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  async handleSubmit() {
    if (this.registerForm.invalid) {
      this.notificationService.show("All fields are required", "error");
      return;
    }

    try {
      const response = await firstValueFrom(this.apiService.registerUser(this.registerForm.getRawValue() as any));

      if (response.status === 200) {
        this.notificationService.show(response.message, "success");
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      console.error('Error registering user:', error);
      this.notificationService.show(error?.error?.message || error?.message || 'An error occurred during registration' + error, 'error');
    }
  }

}
