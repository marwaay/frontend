import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from '../../services/password/password.service';
import { UserService } from '../../services/profile/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-changermdp',
  templateUrl: './changermdp.component.html',
  styleUrl: './changermdp.component.css'
})
export class ChangermdpComponent implements OnInit {
  password!: string; 
    passwordin!: string; 
    newPassword!: string;
    confirmPassword!: string;
    message!: string;
    email!: string;
    oldPassword!: string;
    correctOldPassword: boolean = true;
    userProfile: any ;
 
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private route: ActivatedRoute, private passwordService: PasswordService, private router: Router, private userService: UserService) {
        this.route.queryParams.subscribe(params => {
            this.password = params['password'];

        });
    }

    ngOnInit(): void {

      this.userService.getUserProfile().subscribe(
        (data: any) => {
          this.userProfile = data;
          this.email=this.userProfile.email;
          console.log(this.email)
          if (this.userProfile) {
          } else {
            console.error('User profile data is not available.');
          }
        },
        (error: any) => {
          console.error('Error fetching user profile:', error);
        }
      );
      console.log()
    
  
  





      this.userService.getUserPassword().subscribe(
        (password: string) => {
          console.log('user password:', password);
          this.password = password;
        },
        (error: any) => {
          console.error('Error fetching user data:', error);
        }
      );
    
    }




    changePassword(): void {
      this.passwordService.changPassword(this.oldPassword, this.email, this.newPassword, this.confirmPassword)
        .subscribe(
          (response: any) => { 
            this.message = response.message;
          },
          (error: any) => { 
            if (error.error && error.error.message) {
              this.message = error.error.message;
            } else {
              this.message = 'Une erreur inattendue s\'est produite.';
            }
          }
        );
    }
    

  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility(field: string): void {
    if (field === 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }


  toggleEyeVisibility(field: string): void {
    if (field === 'newPassword') {
      this.showNewPassword = this.newPassword.length > 0;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = this.confirmPassword.length > 0;
    }
  }
  redirectToHome() {
    this.router.navigate(['/homee']);
  }
     
}
