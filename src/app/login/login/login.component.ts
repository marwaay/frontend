import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/auth/login.service';
import { Personnel } from '../../models/Personnel';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
 
})

export class LoginComponent  {
 

  message: string = '';

  personnel: Personnel = new Personnel();

  private url = "http://localhost:8080/auth/login";



  constructor(private loginservice: LoginService, private router: Router, private httpClient: HttpClient) { }

  userlogin(personnel: Personnel): Observable<Personnel> {
    return this.httpClient.post<Personnel>(this.url, personnel); 
  }

  onSubmit() {
    this.userlogin(this.personnel).subscribe(
      (data: any) => { 
        if (data && data.token) { 
          localStorage.setItem('token', data.token); 
          this.router.navigate(['/homee']); 
        }
      },
      (error) => {
        console.error("Login failed:", error); 
        if (error.status === 403) {
          this.message = 'Email or password incorrect.';
        } else {
          this.message = 'An error occurred. Please try again later.';
        }
      }
    );
  }
  
  

  showModal: boolean = false;

  toggleModal() {
    this.showModal = true;
    }
  

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  }

