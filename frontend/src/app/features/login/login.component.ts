import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private router: Router,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  async handleSubmit() {
    if (this.loginForm.invalid) {
      this.notificationService.show("A valid email and password are required", "error");
      return;
    }

    try {
      const response = await firstValueFrom(this.apiService.loginUser(this.loginForm.getRawValue() as any));

      if (response.status === 200 && response.data) {
        this.apiService.saveToStorage('token', response.data.token);
        this.apiService.saveToStorage('role', response.data.role);
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      console.error(error);
      this.notificationService.show(error?.error?.message || error?.message || 'Unable to login a user' + error, 'error');
    }
  }

}
