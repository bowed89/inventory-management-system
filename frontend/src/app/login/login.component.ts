import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';
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
    private apiService: ApiService
  ) { }

  formData: any = {
    email: '',
    password: ''
  };

  message: string | null = '';

  async handleSubmit() {
    if (!this.formData.email ||
      !this.formData.password) {

      this.showMessage("Email and password are required");
      return;
    }

    try {
      const response: any = await firstValueFrom(this.apiService.loginUser(this.formData));

      if (response.status === 200) {
        this.apiService.encryptAndSaveStorage('token', response.token);
        this.apiService.encryptAndSaveStorage('role', response.role);
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      console.error(error);
      this.showMessage(error?.error?.message || error?.message || 'Unable to login a user' + error);
    }
  }

  showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => {
      this.message = null;
    }, 3000);
  }

}
