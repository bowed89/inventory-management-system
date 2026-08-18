import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NotificationService } from '../service/notification.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(
    private router: Router,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  formData: any = {
    email: '',
    name: '',
    phoneNumber: '',
    password: ''
  };

  async handleSubmit() {
    if (!this.formData.email ||
      !this.formData.name ||
      !this.formData.phoneNumber ||
      !this.formData.password) {

      this.notificationService.show("All fields are required");
      return;
    }

    try {
      const response = await firstValueFrom(this.apiService.registerUser(this.formData));

      if (response.status === 200) {
        this.notificationService.show(response.message);
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      console.error('Error registering user:', error);
      this.notificationService.show(error?.error?.message || error?.message || 'An error occurred during registration' + error);
    }
  }

}
