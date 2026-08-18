import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private router: Router,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  formData: any = {
    email: '',
    password: ''
  };

  async handleSubmit() {
    if (!this.formData.email ||
      !this.formData.password) {

      this.notificationService.show("Email and password are required");
      return;
    }

    try {
      const response = await firstValueFrom(this.apiService.loginUser(this.formData));

      if (response.status === 200 && response.data) {
        this.apiService.saveToStorage('token', response.data.token);
        this.apiService.saveToStorage('role', response.data.role);
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      console.error(error);
      this.notificationService.show(error?.error?.message || error?.message || 'Unable to login a user' + error);
    }
  }

}
